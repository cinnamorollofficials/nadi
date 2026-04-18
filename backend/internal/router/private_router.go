package router

import (
	"github.com/gin-gonic/gin"
	customHandler "github.com/hadi-projects/go-react-starter/internal/handler"
	handler "github.com/hadi-projects/go-react-starter/internal/handler/default"
	"github.com/hadi-projects/go-react-starter/internal/middleware"
)

func (r *Router) setupPrivateRoutes(
	v1 *gin.RouterGroup,
	authHandler handler.AuthHandler,
	userHandler handler.UserHandler,
	permissionHandler handler.PermissionHandler,
	roleHandler handler.RoleHandler,
	logHandler handler.LogHandler,
	cacheHandler handler.CacheHandler,
	statisticsHandler handler.StatisticsHandler,
	httpLogHandler handler.HttpLogHandler,
	systemLogHandler handler.SystemLogHandler,
	auditLogHandler handler.AuditLogHandler,
	generatorHandler handler.GeneratorHandler,
	storageHandler customHandler.StorageHandler,
	healthHandler handler.HealthHandler,
	settingHandler handler.SettingHandler,
	apiKeyHandler handler.ApiKeyHandler,
	permGuard *middleware.PermissionGuard,
	blogpostHandler customHandler.BlogPostHandler,
	medicpediapenyakitHandler customHandler.MedicpediaPenyakitHandler,
	medicpedianutrisiHandler customHandler.MedicpediaNutrisiHandler,
		faqHandler customHandler.FaqHandler,
	// [GENERATOR_INSERT_HANDLER_PARAM]
) {
	// Health and Status
	health := v1.Group("/health")
	{
		health.GET("/status", healthHandler.GetStatus)
	}

	// Module Generator
	generator := v1.Group("/generator")
	generator.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		generator.POST("", permGuard.Check("system:gen"), generatorHandler.Generate)
	}
	// Storage routes (authenticated)
	storageGroup := v1.Group("/storage")
	storageGroup.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		storageGroup.POST("/upload", permGuard.Check("storage:upload"), storageHandler.Upload)
		storageGroup.GET("", permGuard.Check("storage:view"), storageHandler.GetFiles)
		storageGroup.GET("/:id", permGuard.Check("storage:view"), storageHandler.GetFileByID)
		storageGroup.DELETE("/:id", permGuard.Check("storage:delete"), storageHandler.DeleteFile)
		storageGroup.GET("/:id/download", permGuard.Check("storage:view"), storageHandler.DownloadFile)
		storageGroup.POST("/:id/share", permGuard.Check("storage:share"), storageHandler.CreateShareLink)
		storageGroup.GET("/:id/shares", permGuard.Check("storage:share"), storageHandler.GetShareLinks)
		storageGroup.PUT("/shares/:shareId", permGuard.Check("storage:share"), storageHandler.UpdateShareLink)
		storageGroup.DELETE("/shares/:shareId", permGuard.Check("storage:share"), storageHandler.RevokeShareLink)
		storageGroup.GET("/shares/:shareId/logs", permGuard.Check("storage:share"), storageHandler.GetShareLinkLogs)
	}

	// Public share routes (no auth required)
	publicGroup := v1.Group("/public")
	{
		publicGroup.GET("/share/:token", storageHandler.PublicFileInfo)
		publicGroup.GET("/share/:token/download", storageHandler.PublicDownload)
		publicGroup.GET("/storage/:id", storageHandler.PublicSystemFile)
		publicGroup.GET("/settings/:category", settingHandler.GetPublicByCategory)

		// Medicpedia Public Routes
		publicGroup.GET("/medicpedia/penyakit", medicpediapenyakitHandler.GetPublicAll)
		publicGroup.GET("/medicpedia/penyakit/:slug", medicpediapenyakitHandler.GetBySlug)
		publicGroup.GET("/medicpedia/nutrisi", medicpedianutrisiHandler.GetPublicAll)
		publicGroup.GET("/medicpedia/nutrisi/:slug", medicpedianutrisiHandler.GetBySlug)

		// FAQ Public Routes
		publicGroup.GET("/faqs", faqHandler.GetAll)
	}

	blogpost := v1.Group("/blogposts")
	blogpost.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		blogpost.POST("", permGuard.Check("blogpost:create"), blogpostHandler.Create)
		blogpost.GET("", permGuard.Check("blogpost:view"), blogpostHandler.GetAll)
		blogpost.GET("/export", permGuard.Check("system:export"), blogpostHandler.Export)
		blogpost.GET("/:id", permGuard.Check("blogpost:view"), blogpostHandler.GetByID)
		blogpost.PUT("/:id", permGuard.Check("blogpost:edit"), blogpostHandler.Update)
		blogpost.DELETE("/:id", permGuard.Check("blogpost:delete"), blogpostHandler.Delete)
	}
	medicpediapenyakit := v1.Group("/medicpedia_penyakit")
	medicpediapenyakit.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		medicpediapenyakit.POST("", permGuard.Check("penyakit:create"), medicpediapenyakitHandler.Create)
		medicpediapenyakit.GET("", permGuard.Check("penyakit:view"), medicpediapenyakitHandler.GetAll)
		medicpediapenyakit.GET("/export", permGuard.Check("system:export"), medicpediapenyakitHandler.Export)
		medicpediapenyakit.GET("/:id", permGuard.Check("penyakit:view"), medicpediapenyakitHandler.GetByID)
		medicpediapenyakit.PUT("/:id", permGuard.Check("penyakit:edit"), medicpediapenyakitHandler.Update)
		medicpediapenyakit.DELETE("/:id", permGuard.Check("penyakit:delete"), medicpediapenyakitHandler.Delete)
	}
	medicpedianutrisi := v1.Group("/medicpedia_nutrisi")
	medicpedianutrisi.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		medicpedianutrisi.POST("", permGuard.Check("nutrisi:create"), medicpedianutrisiHandler.Create)
		medicpedianutrisi.GET("", permGuard.Check("nutrisi:view"), medicpedianutrisiHandler.GetAll)
		medicpedianutrisi.GET("/export", permGuard.Check("system:export"), medicpedianutrisiHandler.Export)
		medicpedianutrisi.GET("/:id", permGuard.Check("nutrisi:view"), medicpedianutrisiHandler.GetByID)
		medicpedianutrisi.PUT("/:id", permGuard.Check("nutrisi:edit"), medicpedianutrisiHandler.Update)
		medicpedianutrisi.DELETE("/:id", permGuard.Check("nutrisi:delete"), medicpedianutrisiHandler.Delete)
	}
		faq := v1.Group("/faqs")
	faq.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		faq.POST("", permGuard.Check("faq:create"), faqHandler.Create)
		faq.GET("", permGuard.Check("faq:view"), faqHandler.GetAll)
		faq.GET("/export", permGuard.Check("system:export"), faqHandler.Export)
		faq.GET("/:id", permGuard.Check("faq:view"), faqHandler.GetByID)
		faq.PUT("/:id", permGuard.Check("faq:edit"), faqHandler.Update)
		faq.DELETE("/:id", permGuard.Check("faq:delete"), faqHandler.Delete)
	}
	// [GENERATOR_INSERT_GROUP]
	auth := v1.Group("/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/logout", middleware.AuthMiddleware(r.config.JWT.Secret, r.cache), authHandler.Logout)
		auth.POST("/register", userHandler.Register)
		auth.POST("/forgot-password", authHandler.ForgotPassword)
		auth.POST("/reset-password", authHandler.ResetPassword)
		auth.GET("/validate-reset-token", authHandler.ValidateResetToken)
		auth.GET("/validate-email-token", authHandler.ValidateEmailToken)
		auth.POST("/refresh", authHandler.RefreshToken)
		auth.POST("/verify-email", authHandler.VerifyEmail)
		auth.POST("/google", authHandler.LoginWithGoogle)
		// 2FA routes
		auth.POST("/2fa/verify", authHandler.Verify2FA) // Public: no JWT needed
		auth.POST("/2fa/enroll", middleware.AuthMiddleware(r.config.JWT.Secret, r.cache), authHandler.Enroll2FA)
		auth.POST("/2fa/confirm", middleware.AuthMiddleware(r.config.JWT.Secret, r.cache), authHandler.Confirm2FA)
		auth.DELETE("/2fa/disable", middleware.AuthMiddleware(r.config.JWT.Secret, r.cache), authHandler.Disable2FA)
		auth.POST("/2fa/reset-request", authHandler.Request2FAReset) // Public: needs temp token
		auth.POST("/2fa/reset-confirm", authHandler.Confirm2FAReset) // Public: needs email format token
	}

	logs := v1.Group("/logs")
	logs.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		// Internal permission check is handled inside GetLogs
		logs.GET("", logHandler.GetLogs)
		logs.GET("/export", permGuard.Check("system:export"), logHandler.Export) // Combined logs export
		logs.GET("/http", permGuard.Check("log:http"), httpLogHandler.GetAll)
		logs.GET("/http/export", permGuard.Check("system:export"), httpLogHandler.Export)
		logs.GET("/system", permGuard.Check("log:system"), systemLogHandler.GetAll)
		logs.GET("/system/export", permGuard.Check("system:export"), systemLogHandler.Export)
		logs.GET("/audit", permGuard.Check("log:audit"), auditLogHandler.GetAll)
		logs.GET("/audit/export", permGuard.Check("system:export"), auditLogHandler.Export)
	}

	users := v1.Group("/users")
	users.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		// User can access their own profile
		users.GET("/me", userHandler.Me)

		// Admin only for CRUD
		users.POST("", permGuard.Check("user:create"), userHandler.Create)
		users.GET("", permGuard.Check("user:view"), userHandler.GetAll)
		users.GET("/export", permGuard.Check("system:export"), userHandler.Export)
		users.PUT("/:id", permGuard.Check("user:edit"), userHandler.Update)
		users.DELETE("/:id", permGuard.Check("user:delete"), userHandler.Delete)
	}

	permissions := v1.Group("/permissions")
	permissions.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		permissions.POST("", permGuard.Check("permission:create"), permissionHandler.Create)
		permissions.GET("", permGuard.Check("permission:view"), permissionHandler.GetAll)
		permissions.GET("/export", permGuard.Check("system:export"), permissionHandler.Export)
		permissions.PUT("/:id", permGuard.Check("permission:edit"), permissionHandler.Update)
		permissions.DELETE("/:id", permGuard.Check("permission:delete"), permissionHandler.Delete)
	}

	roles := v1.Group("/roles")
	roles.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		roles.POST("", permGuard.Check("role:create"), roleHandler.Create)
		roles.GET("", permGuard.Check("role:view"), roleHandler.GetAll)
		roles.GET("/export", permGuard.Check("system:export"), roleHandler.Export)
		roles.GET("/:id", permGuard.Check("role:view"), roleHandler.GetByID)
		roles.PUT("/:id", permGuard.Check("role:edit"), roleHandler.Update)
		roles.DELETE("/:id", permGuard.Check("role:delete"), roleHandler.Delete)
	}

	// Statistics
	statistics := v1.Group("/statistics")
	statistics.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		statistics.GET("/dashboard", permGuard.Check("system:stat"), statisticsHandler.GetDashboardStats)
	}

	// Cache management
	cache := v1.Group("/cache")
	cache.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		cache.DELETE("/clear", permGuard.Check("service:manage_redis"), cacheHandler.ClearAll)
		cache.GET("/status", permGuard.Check("service:view_redis"), cacheHandler.GetStatus)
	}

	// Settings management
	settings := v1.Group("/settings")
	settings.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		// Internal category check is recommended in handler for granular setting:view_category
		settings.GET("/:category", settingHandler.GetByCategory)
		settings.PUT("", settingHandler.BulkUpdate)
	}

	// API Keys management
	apiKeys := v1.Group("/apikeys")
	apiKeys.Use(middleware.AuthMiddleware(r.config.JWT.Secret, r.cache))
	{
		apiKeys.POST("", permGuard.Check("apikey:create"), apiKeyHandler.Create)
		apiKeys.GET("", permGuard.Check("apikey:view"), apiKeyHandler.GetAll)
		apiKeys.DELETE("/:id", permGuard.Check("apikey:delete"), apiKeyHandler.Delete)
	}
}
