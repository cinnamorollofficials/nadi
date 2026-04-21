package router

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"encoding/base64"

	"github.com/gin-gonic/gin"
	"github.com/hadi-projects/go-react-starter/config"
	customHandler "github.com/hadi-projects/go-react-starter/internal/handler"
	handler "github.com/hadi-projects/go-react-starter/internal/handler/default"
	"github.com/hadi-projects/go-react-starter/internal/middleware"
	customRepository "github.com/hadi-projects/go-react-starter/internal/repository"
	repository "github.com/hadi-projects/go-react-starter/internal/repository/default"
	customService "github.com/hadi-projects/go-react-starter/internal/service"
	service "github.com/hadi-projects/go-react-starter/internal/service/default"
	"github.com/hadi-projects/go-react-starter/pkg/cache"
	"github.com/hadi-projects/go-react-starter/pkg/crypto"
	"github.com/hadi-projects/go-react-starter/pkg/kafka"
	"github.com/hadi-projects/go-react-starter/pkg/logger"
	"github.com/hadi-projects/go-react-starter/pkg/mailer"
	"github.com/hadi-projects/go-react-starter/pkg/storage"
	"gorm.io/gorm"
)

type Router struct {
	config        *config.Config
	db            *gorm.DB
	cache         cache.CacheService
	kafkaProducer kafka.Producer
	mailer        mailer.Mailer
	engine        *gin.Engine
}

func NewRouter(config *config.Config, db *gorm.DB, cache cache.CacheService, kafkaProducer kafka.Producer, mailer mailer.Mailer) *Router {
	return &Router{
		config:        config,
		db:            db,
		cache:         cache,
		kafkaProducer: kafkaProducer,
		mailer:        mailer,
	}
}

func (r *Router) SetupRouter() *gin.Engine {
	if r.engine != nil {
		return r.engine
	}
	if r.config.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	router := gin.New()

	// Use db from Router struct
	db := r.db

	// Repositories initializations for middleware
	httpLogRepo := repository.NewHttpLogRepository(db)
	systemLogRepo := repository.NewSystemLogRepository(db)
	auditLogRepo := repository.NewAuditLogRepository(db)

	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware(r.config))
	router.Use(middleware.RequestLogger(r.config, httpLogRepo))
	router.Use(middleware.RequestCancellation(time.Duration(r.config.Security.RequestTimeOut) * time.Second))
	router.Use(middleware.RateLimiter(r.config.RateLimit.Rps, r.config.RateLimit.Burst))
	router.Use(middleware.SecureHeaders())
	router.Use(middleware.XSSProtection())

	// Repositories
	userRepo := repository.NewUserRepository(db)
	permissionRepo := repository.NewPermissionRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	tokenRepo := repository.NewTokenRepository(db)
	storageFileRepo := customRepository.NewStorageFileRepository(db)
	shareLinkRepo := customRepository.NewShareLinkRepository(db)
	settingRepo := repository.NewSettingRepository(db)
	apiKeyRepo := repository.NewApiKeyRepository(db)
	blogpostRepo := customRepository.NewBlogPostRepository(db)
	medicpediapenyakitRepo := customRepository.NewMedicpediaPenyakitRepository(db)
	medicpedianutrisiRepo := customRepository.NewMedicpediaNutrisiRepository(db)
	faqRepo := customRepository.NewFaqRepository(db)
	chatRepo := customRepository.NewChatRepository(db)
	aiUsageRepo := customRepository.NewAiUsageRepository(db)
	// [GENERATOR_INSERT_REPOSITORY]

	// Initialize Encryptor
	keyBytes, _ := base64.StdEncoding.DecodeString(r.config.Security.EncryptionKey)
	encryptor, _ := crypto.NewEncryptor(keyBytes)

	// Services
	settingService := service.NewSettingService(settingRepo, r.config)
	authService := service.NewAuthService(userRepo, tokenRepo, r.kafkaProducer, r.mailer, r.config, r.cache, settingService)
	userService := service.NewUserService(userRepo, tokenRepo, roleRepo, r.config, r.cache, r.kafkaProducer, r.mailer, settingService)
	permissionService := service.NewPermissionService(permissionRepo, r.cache)
	roleService := service.NewRoleService(roleRepo, r.cache)
	logService := service.NewLogService(r.config)
	statisticsService := service.NewStatisticsService(db)
	httpLogService := service.NewHttpLogService(httpLogRepo, r.cache)
	systemLogService := service.NewSystemLogService(systemLogRepo, r.cache)
	auditLogService := service.NewAuditLogService(auditLogRepo, r.cache)
	storageDriver := storage.NewLocalDriver(r.config.Storage.BasePath)
	storageService := customService.NewStorageService(
		storageFileRepo,
		shareLinkRepo,
		storageDriver,
		r.cache,
		r.config.Frontend.URL,
		settingService,
	)
	apiKeyService := service.NewApiKeyService(apiKeyRepo, roleRepo, r.cache)
	blogpostService := customService.NewBlogPostService(blogpostRepo, r.cache)
	medicpediapenyakitService := customService.NewMedicpediaPenyakitService(medicpediapenyakitRepo, r.cache)
	medicpedianutrisiService := customService.NewMedicpediaNutrisiService(medicpedianutrisiRepo, r.cache)
	faqService := customService.NewFaqService(faqRepo, r.cache)
	geminiService := customService.NewGeminiService(r.config, chatRepo)
	chatService := customService.NewChatService(chatRepo, userRepo, aiUsageRepo, geminiService, encryptor)
	// [GENERATOR_INSERT_SERVICE]

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userService)
	permissionHandler := handler.NewPermissionHandler(permissionService)
	roleHandler := handler.NewRoleHandler(roleService)
	logHandler := handler.NewLogHandler(logService, r.cache, permissionRepo)
	cacheHandler := handler.NewCacheHandler(r.cache)
	statisticsHandler := handler.NewStatisticsHandler(statisticsService)
	httpLogHandler := handler.NewHttpLogHandler(httpLogService)
	systemLogHandler := handler.NewSystemLogHandler(systemLogService)
	auditLogHandler := handler.NewAuditLogHandler(auditLogService)
	generatorHandler := handler.NewGeneratorHandler(".", db)
	storageHandler := customHandler.NewStorageHandler(storageService)
	healthHandler := handler.NewHealthHandler(r.cache, r.kafkaProducer)
	settingHandler := handler.NewSettingHandler(settingService)
	apiKeyHandler := handler.NewApiKeyHandler(apiKeyService)
	blogpostHandler := customHandler.NewBlogPostHandler(blogpostService)
	medicpediapenyakitHandler := customHandler.NewMedicpediaPenyakitHandler(medicpediapenyakitService)
	medicpedianutrisiHandler := customHandler.NewMedicpediaNutrisiHandler(medicpedianutrisiService)
	faqHandler := customHandler.NewFaqHandler(faqService)
	chatHandler := customHandler.NewChatHandler(chatService)
	aiHandler := handler.NewAiHandler(aiUsageRepo)
	// [GENERATOR_INSERT_HANDLER]

	v1 := router.Group("/api/v1")
	{
		v1.Use(middleware.APIKeyMiddleware(apiKeyService))

		r.setupPrivateRoutes(v1, authHandler, userHandler, permissionHandler, roleHandler, logHandler, cacheHandler, statisticsHandler, httpLogHandler, systemLogHandler, auditLogHandler,

			generatorHandler,
			storageHandler,
			healthHandler,
			settingHandler,
			apiKeyHandler,
			middleware.NewPermissionGuard(r.cache, permissionRepo),
			blogpostHandler,
			medicpediapenyakitHandler,
			medicpedianutrisiHandler,
			faqHandler,
			chatHandler,
			aiHandler,
			// [GENERATOR_INSERT_HANDLER_PARAM]
		)
	}

	logger.SystemLogger.Info().Str("port", r.config.App.Port).Msg("Server running")
	r.engine = router
	return r.engine
}

func (r *Router) Run() {
	srv := &http.Server{
		Addr:           ":" + r.config.App.Port,
		Handler:        r.SetupRouter(),
		ReadTimeout:    time.Duration(r.config.Security.RequestTimeOut) * time.Second,
		WriteTimeout:   time.Duration(r.config.Security.RequestTimeOut) * time.Second,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	go func() {
		logger.SystemLogger.Info().Str("port", r.config.App.Port).Msg("Starting HTTP server")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.SystemLogger.Fatal().Err(err).Msg("Failed to start server")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.SystemLogger.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	fmt.Println("Server exited successfully")
}
