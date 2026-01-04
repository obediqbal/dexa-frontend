import { useState, useEffect } from 'react';
import { RegisterStaffRequest, Role, Staff } from '../types/staff';
import { staffApi } from '../api';
import './CreateStaffModal.css';

interface CreateStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    staff?: Staff | null;
}

export function CreateStaffModal({ isOpen, onClose, onSuccess, staff }: CreateStaffModalProps) {
    const isEditMode = !!staff;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<RegisterStaffRequest>({
        email: '',
        password: '',
        role: Role.STAFF,
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        position: '',
        isActive: true,
    });

    useEffect(() => {
        if (staff) {
            setFormData({
                email: staff.email,
                password: '', // Don't populate password for edit mode
                role: Role.STAFF, // Default role, staff doesn't have role property
                firstName: staff.firstName,
                lastName: staff.lastName,
                phone: staff.phone || '',
                department: staff.department || '',
                position: staff.position || '',
                isActive: staff.isActive,
            });
        } else {
            setFormData({
                email: '',
                password: '',
                role: Role.STAFF,
                firstName: '',
                lastName: '',
                phone: '',
                department: '',
                position: '',
                isActive: true,
            });
        }
        setError(null);
    }, [staff, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isEditMode && staff) {
                // For edit mode, only send changed fields (excluding password if empty)
                const updateData: Partial<Staff> = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    department: formData.department || undefined,
                    position: formData.position || undefined,
                    isActive: formData.isActive,
                };
                await staffApi.updateStaff(staff.id, updateData);
            } else {
                // Create mode
                await staffApi.registerStaff(formData);
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string | string[] } } };
            const message = error.response?.data?.message;
            setError(Array.isArray(message) ? message.join(', ') : message || `Failed to ${isEditMode ? 'update' : 'register'} staff`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditMode ? 'Edit Staf' : 'Tambah staf baru'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="staff-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nama Depan</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nama Belakang</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Alamat Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isEditMode && (
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value={Role.STAFF}>Staff</option>
                                <option value={Role.ADMIN}>Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Nomor Telepon</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Departemen</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Posisi</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {isEditMode && (
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                />
                                <span>Staf Aktif</span>
                            </label>
                            <p className="field-hint">
                                {formData.isActive ? 'Staf dapat login dan melakukan presensi' : 'Staff tidak dapat login'}
                            </p>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Batal
                        </button>
                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? (isEditMode ? 'Menyimpan...' : 'Mendaftarkan...') : (isEditMode ? 'Simpan Perubahan' : 'Tambahkan Staf')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
