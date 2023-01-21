import './FileView.less';
import {useState} from 'fiddlehead';
import {TextArea} from './../../../components/text-area/TextArea';

export let FileView = ({file, onChange, defaultCollapsed}) => {
    let [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
        <div class="FileView">
            <div
                class="filename"
                onClick={() => setCollapsed(t => !t)}
            >
                {file.filename}
            </div>
            {
                !collapsed &&
                <TextArea
                    defaultValue={file.code}
                    onInput={(event) => {
                        onChange({
                            filename: file.filename,
                            language: file.language,
                            code: event.target.value
                        });
                    }}
                    spellcheck="false"
                />
            }
        </div>
    );
};
