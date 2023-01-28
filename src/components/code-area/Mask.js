import {useRef, useEffect} from 'fiddlehead';
import {highlightElement} from '../../modules/highlight';
import {border_radius, color, gray} from '../../style/theme';
import {getCaretPosition} from '../../utils/getCaretPosition';
import {TAB_SIZE} from './tabSize';

export let Mask = ({content, onSelectionChange, focused, onFocusChange, language}) => {
    let codeElementRef = useRef(null);

    useEffect(() => {
        if (codeElementRef.current !== null) {
            highlightElement(codeElementRef.current);
        }
    }, []);

    let handleSelectionChange = () => {
        requestAnimationFrame(() => {
            // Call the callback in the next animation frame, because
            // we need to wait for the window to recognize the selection
            onSelectionChange(getCaretPosition(codeElementRef.current));
        });
    };

    return (
        <pre class={`language-${language}`}>
            <code
                class={`language-${language}`}
                onSelectStart={() => {
                    // This event will not fire when a range is selected,
                    // it only fires when the user start selecting.
                    handleSelectionChange();
                }}
                onKeyDown={() => {
                    // In case of error, when the user is typing
                    // we will try to load the Mirror again
                    handleSelectionChange();
                }}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                contenteditable
                spellcheck="false"
                autocorrect="off"
                autocapitalize="off"
                translate="no"
                data-gramm="false" // disable Grammarly
                style={{
                    tabSize: TAB_SIZE,
                    caretColor: gray.black,
                    outline: 'none',
                }}
                ref={codeElementRef}
            >
                {content}
            </code>
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    borderRadius: `${border_radius.level_2}px`,
                    boxShadow: focused ? `inset 0 0 0 1px ${color.primary}` : null,
                }}
            />
        </pre>
    );
};
