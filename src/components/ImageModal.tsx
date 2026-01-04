import { FC } from 'react';
import './ImageModal.css';

interface ImageModalProps {
    imageUrl: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ImageModal: FC<ImageModalProps> = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen || !imageUrl) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="image-modal-backdrop" onClick={handleBackdropClick}>
            <div className="image-modal-content">
                <button className="image-modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>
                <img
                    src={imageUrl}
                    alt="Attendance photo"
                    className="image-modal-img"
                    onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                        e.currentTarget.alt = 'Image failed to load';
                    }}
                />
            </div>
        </div>
    );
};
