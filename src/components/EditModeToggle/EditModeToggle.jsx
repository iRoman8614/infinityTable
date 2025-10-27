import { useEditMode } from '@/context/EditModeContext';
import './EditModeToggle.css';

const EditModeToggle = () => {
    const { editMode, toggleEditMode } = useEditMode();

    return (
        <div className="edit-mode-toggle">
            <label className="edit-mode-label">
                <input
                    type="checkbox"
                    checked={editMode}
                    onChange={toggleEditMode}
                    className="edit-mode-checkbox"
                />
                <span className="edit-mode-text">
                    Режим редактирования
                </span>
                {editMode && (
                    <span className="edit-mode-badge">Активен</span>
                )}
            </label>
        </div>
    );
};

export default EditModeToggle;