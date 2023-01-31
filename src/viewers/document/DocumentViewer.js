import './DocumentViewer.less';
import {useCallback, useEffect, useRef} from 'fiddlehead';
import {MarkdownViewer} from '../markdown/MarkdownViewer';
import {__} from '../../modules/i18n';
import {useSelect} from '../../modules/store';
import {Link} from '../../modules/router';
import {Button} from '../../components/button/Button';
import {LeftArrowIcon} from '../../icons/LeftArrowIcon';
import {RightArrowIcon} from '../../icons/RightArrowIcon';
import {AltGithubIcon} from '../../icons/AltGithubIcon';
import {PlaygroundViewer} from '../playground/PlaygroundViewer';
import {SidebarPortal} from '../../layout/sidebar/Sidebar';
import {TableOfContents} from './TableOfContents';

const MIN_HEADINGS_TO_SHOW_TOC = 2;

export let DocumentViewer = ({
    headings = [],
    contents = [],
    contentPath,
    previous,
    next,
}) => {
    let tocRef = useRef(null);
    let contentsRef = useRef(null);

    let scrollee = useSelect(data => data.layoutScroll.element);
    let scroller = useSelect(data => data.layoutScroll.object);

    // Scroll into the heading which matches the requested hash
    useEffect(() => {
        if (window.location.hash) {
            let heading = document.getElementById(
                window.location.hash.slice(1)
            );

            if (heading) {
                heading.scrollIntoView();
            }
        }
    }, []);

    let getScrolling = useCallback(() => {
        if (scrollee === document.documentElement) {
            return {
                height: window.innerHeight,
                top: 0,
                scrollHeight: document.documentElement.offsetHeight,
                scrollTop: window.scrollY,
            };
        }

        let scrolleeRect = scrollee.getBoundingClientRect();

        return {
            height: scrolleeRect.height,
            top: scrolleeRect.top,
            scrollHeight: scrollee.scrollHeight,
            scrollTop: scrollee.scrollTop,
        };
    }, [scrollee, scroller]);

    let getTocMixins = () => {
        return headings.map(({id, level}) => ({
            heading: document.getElementById(id),
            tocItem: tocRef.current.querySelector(`li[data-id="${id}"]`),
            level: level,
        })).filter(({id, heading}) => {
            if (heading === null) {
                console.error('Heading not found: ', id);
                return false;
            }
            return true;
        });
    };

    let updateToc = (tocMixins) => {
        if (contentsRef.current === null) {
            return;
        }

        let scrolling = getScrolling();

        tocMixins.map(({heading, tocItem, level}, index) => {
            let headingRect = heading.getBoundingClientRect();

            // Find next heading with the same or lower level
            // h2 (current) -> h3 (skip) -> h2 (found)
            // h3 (current) -> h3 (skip) -> h2 (found)
            let nextHeading;
            for (let i = index + 1; i < tocMixins.length; i++) {
                if (tocMixins[i].level <= level) {
                    nextHeading = tocMixins[i].heading;
                    break;
                }
            }

            // We expect the content appear at the center area of the screen
            // not too close to top or bottom
            // so 30% of viewport height at top and bottom will be ignore
            // except the case it reaches the top or bottom of scrollee
            let marginTop = Math.min(
                0.3 * scrolling.height,
                scrolling.scrollTop
            );
            let marginBottom = Math.min(
                0.3 * scrolling.height,
                scrolling.scrollHeight - scrolling.height - scrolling.scrollTop
            );

            // Check if current section is active
            // and calculate section height
            let active, sectionHeight;
            // If there is next heading, we will use the top of the next heading as the bottom border of current section
            if (nextHeading) {
                let nextHeadingRect = nextHeading.getBoundingClientRect();
                sectionHeight = nextHeadingRect.top - headingRect.top;
                active = (
                    headingRect.bottom < scrolling.height + scrolling.top - Math.min(marginBottom, sectionHeight)
                    && nextHeadingRect.top > scrolling.top + Math.min(marginTop, sectionHeight)
                );
            }
            // If no next heading, we will use the bottom of whole content area instead
            else {
                let contentsRect = contentsRef.current.getBoundingClientRect();
                sectionHeight = contentsRect.bottom - headingRect.top + 1;
                active = (
                    headingRect.bottom < scrolling.height + scrolling.top - Math.min(marginBottom, sectionHeight)
                    && contentsRect.bottom > scrolling.top + Math.min(marginTop, sectionHeight)
                );
            }

            tocItem.setAttribute('data-active', active);

            // Check if current section is focused
            // The difference between focused and active, is that focused is used for child sections
            // If, one of child sections is focused, then parent section is active
            if (!active) {
                tocItem.setAttribute('data-focused', false);
            } else {
                if (index === tocMixins.length - 1) {
                    tocItem.setAttribute('data-focused', true);
                } else {
                    let siblingHeading = tocMixins[index + 1].heading;
                    let siblingHeadingRect = siblingHeading.getBoundingClientRect();

                    tocItem.setAttribute('data-focused',
                        headingRect.bottom < scrolling.height + scrolling.top - Math.min(marginBottom, sectionHeight)
                        && siblingHeadingRect.top > scrolling.top + Math.min(marginTop, sectionHeight)
                    );
                }
            }
        });
    };

    // When the user is scrolling contents,
    // table-of-contents needs to indicate what contents are displaying in the viewport
    useEffect(() => {
        if (tocRef.current === null) {
            return;
        }

        let tocMixins = getTocMixins();

        updateToc(tocMixins);

        let handleEvent = () => updateToc(tocMixins);
        let listenOptions = {passive: true};

        scroller.addEventListener('scroll', handleEvent, listenOptions);
        window.addEventListener('resize', handleEvent, listenOptions);

        return () => {
            scroller.removeEventListener('scroll', handleEvent, listenOptions);
            window.removeEventListener('resize', handleEvent, listenOptions);
        };
    }, [scrollee, scroller, getScrolling]);

    let getContents = () => {
        let headingPosRef = {current: -1};

        return contents.map((content, index) => {
            if (typeof content === 'string') {
                return (
                    <MarkdownViewer
                        key={index}
                        content={content}
                        headings={headings}
                        headingPosRef={headingPosRef}
                    />
                );
            }

            if (content.playground !== undefined) {
                const {fileList} = content.playground;

                return (
                    <PlaygroundViewer
                        fileList={fileList}
                    />
                );
            }
        });
    };

    let showsToc = headings.length >= MIN_HEADINGS_TO_SHOW_TOC;

    return (
        <div class="DocumentViewer">
            <div class="contents" ref={contentsRef}>
                {
                    getContents()
                }
                {(previous !== null || next !== null) && (
                    <div class="quick-nav">
                        {previous !== null ? (
                            <Link href={previous.path}>
                                <Button>
                                    <LeftArrowIcon />
                                    <span>{previous.label}</span>
                                </Button>
                            </Link>
                        ) : <span />}
                        {next !== null ? (
                            <Link href={next.path}>
                                <Button>
                                    <span>{next.label}</span>
                                    <RightArrowIcon />
                                </Button>
                            </Link>
                        ) : <span />}
                    </div>
                )}
            </div>
            <div class="bottom">
                <a
                    href={`https://github.com/fiddleheadjs/fiddlehead-docs/blob/master/src/contents/${contentPath}/index.md`}
                    target="_blank"
                >
                    <Button variant="textual" size="small">
                        <span>{__('Edit this page')}</span>
                        <span>&middot;</span>
                        <AltGithubIcon size="1.2em" />
                    </Button>
                </a>
            </div>
            {
                showsToc &&
                <SidebarPortal>
                    <TableOfContents
                        headings={headings}
                        ref={tocRef}
                    />
                </SidebarPortal>
            }
        </div>
    );
}
