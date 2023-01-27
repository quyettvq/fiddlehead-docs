import './Section.less';
import {useState} from 'fiddlehead';

export let Section = ({
    icon,
    title,
    actions,
    children,
    defaultOpen = null,
    forcesClose = false,
    usesCssToClose = false,
    class: className,
    bodyPadding = false,
    ...otherProps
}) => {
    let touchable = !forcesClose && defaultOpen !== null;
    let [open, setOpen] = useState(defaultOpen !== null ? defaultOpen : true);

    let toggle = () => {
        if (touchable) {
            setOpen(open => !open);
        }
    };

    let finalOpen = !forcesClose && open;

    return (
        <div
            class={`Section ${className}`}
            {...otherProps}
        >
            <div
                class={`heading${touchable ? ' touchable' : ''}`}
                onClick={toggle}
            >
                <div class="title">
                    {icon}
                    <span>{title}</span>
                </div>
                {
                    actions != null &&
                    <div class="actions">
                        {actions}
                    </div>
                }
            </div>
            {
                (finalOpen || usesCssToClose) &&
                <div
                    class={`body${bodyPadding ? ' padding' : ''}`}
                    style={{display: finalOpen ? null : 'none'}}
                >
                    {children}
                </div>
            }
        </div>
    );
};
