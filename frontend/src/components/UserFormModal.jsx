import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import Modal from './Modal';
import TextField from './TextField';
import Button from './Button';
import { getRoles, getAiTiers } from '../api/admin';
import { ROLES } from '../utils/constants';

const UserFormModal = ({ isOpen, onClose, onSubmit, user, loading = false }) => {
    const isEdit = !!user;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role_id: ROLES.ADMIN,
        status: 'active',
        ai_tier_id: '',
        usage_limit: 0,
    });
    const [errors, setErrors] = useState({});

    // Fetch User Roles
    const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
        queryKey: ['roles', 'user'],
        queryFn: () => getRoles(1, 100, '', 'user'),
        enabled: isOpen,
    });

    // Fetch AI Tiers
    const { data: tiersData, isLoading: isLoadingTiers } = useQuery({
        queryKey: ['ai-tiers', 'select'],
        queryFn: () => getAiTiers(1, 100),
        enabled: isOpen,
    });

    const roles = rolesData?.data || [];
    const tiers = tiersData?.data || [];

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                password: '',
                role_id: user.role_id || ROLES.ADMIN,
                status: user.status || 'active',
                ai_tier_id: user.ai_tier_id || '',
                usage_limit: user.usage_limit || 0,
            });
        } else {
            setFormData({
                email: '',
                password: '',
                role_id: ROLES.ADMIN,
                status: 'active',
                ai_tier_id: '',
                usage_limit: 0,
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'role_id' || name === 'ai_tier_id' || type === 'number' ? 
                (value === "" ? "" : parseInt(value)) : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!isEdit && !formData.password) {
            newErrors.password = 'Password is required';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // For edit, only send password if it's filled
            const submitData = { ...formData };
            if (isEdit && !submitData.password) {
                delete submitData.password;
            }
            onSubmit(submitData);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit User' : 'Create User'}
            maxWidth="max-w-lg"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        helperText={isEdit ? 'Leave empty to keep current password' : ''}
                        required={!isEdit}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-field-label">User Role</label>
                            <select
                                name="role_id"
                                value={formData.role_id}
                                onChange={handleChange}
                                className="text-field"
                            >
                                <option value="">{isLoadingRoles ? 'Loading...' : 'Select Role'}</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-field-label">Account Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="text-field"
                            >
                                <option value="active">Active</option>
                                <option value="freezed">Freezed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="my-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                        <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            AI Configuration
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-field-label text-xs">AI Tier Plan</label>
                                <select
                                    name="ai_tier_id"
                                    value={formData.ai_tier_id}
                                    onChange={handleChange}
                                    className="text-field"
                                >
                                    <option value="">{isLoadingTiers ? 'Loading...' : 'Select AI Tier'}</option>
                                    {tiers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.daily_limit} msgs/day)</option>
                                    ))}
                                </select>
                            </div>

                            <TextField
                                label="Custom Daily Limit Override"
                                name="usage_limit"
                                type="number"
                                value={formData.usage_limit}
                                onChange={handleChange}
                                helperText="Set to 0 to use Tier default limit"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={loading} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

UserFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    user: PropTypes.object,
    loading: PropTypes.bool,
};

export default UserFormModal;
