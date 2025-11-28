import {useCallback, useRef, useState} from 'react';
import {MdGif} from 'react-icons/md';
import giphyLogo from 'url:../giphy.png';
import {browserRuntime} from '../browser-runtime.js';
import GifThumbnail from './gif-thumbnail.js';
import Loader from './loader.js';

export const addGifInputId = 'add-gif-input';
export const addGifButtonId = 'add-gif-button';

const GifButton = ({textarea}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isShowingGifs, setIsShowingGifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const debounceId = useRef(null);
  const scrollContainerReference = useRef(null);
  const isLoadingReference = useRef(false);
  const [isShowingLoadingIndicator, setIsShowingLoadingIndicator] = useState(false);
  const isLoadingMoreReference = useRef(false);

  const searchGiphy = useCallback((query, currentOffset = 0, append = false) => {
    if (append) {
      isLoadingMoreReference.current = true;
    } else {
      isLoadingReference.current = true;
    }

    debounceId.current = null;
    setIsShowingLoadingIndicator(true);

    browserRuntime.sendMessage(
      {
        type: 'gifSearch',
        data: {query, offset: currentOffset},
      },
      response => {
        isLoadingReference.current = false;
        isLoadingMoreReference.current = false;

        if (response.type === 'gifResults') {
          setGifs(previousGifs => {
            const newGifs = append ? [...previousGifs, ...response.data] : response.data;
            return newGifs;
          });
          setHasMore(response.hasMore);
          const newOffset = currentOffset + response.data.length;
          setOffset(newOffset);
        } else if (response.type === 'error') {
          setErrorMessage(response.data);
        }
      },
    );
  }, []);

  const handleSearchChange = useCallback(
    event_ => {
      if (debounceId.current) {
        clearTimeout(debounceId.current);
      }

      isLoadingReference.current = false;
      isLoadingMoreReference.current = false;
      setErrorMessage(null);
      setSearchTerm(event_.target.value);
      if (event_.target.value.trim() !== '') {
        setGifs([]);
        setOffset(0);
        setHasMore(true);
        debounceId.current = setTimeout(() => searchGiphy(event_.target.value, 0, false), 750);
      }
    },
    [searchGiphy],
  );

  const appendGifMarkdown = useCallback(
    gif => {
      const gifUrl = gif.images.downsized_medium.url;
      const markdown = `![GIF](${gifUrl})`;
      // eslint-disable-next-line react-hooks/immutability
      textarea.value += markdown;
      textarea.dispatchEvent(new Event('input', {bubbles: true}));
    },
    [textarea],
  );

  const handleScroll = useCallback(() => {
    if (!scrollContainerReference.current || isLoadingMoreReference.current || !hasMore || scrollContainerReference.current.clientHeight >= scrollContainerReference.current.scrollHeight) {
      return;
    }

    const {scrollTop, scrollHeight, clientHeight} = scrollContainerReference.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      searchGiphy(searchTerm, offset, true);
    }
  }, [hasMore, searchTerm, offset, searchGiphy]);

  return (
    <>
      <a
        id={addGifButtonId}
        style={{marginBottom: '8px'}}
        className='Button--invisible Button--small Button'
        onClick={() => setIsShowingGifs(!isShowingGifs)}
      >
        <span className='Button-content'>
          <span className='Button-visual Button-leadingVisual'>
            <MdGif size='24' />
          </span>
          <span
            className='Button-label'
            style={{color: 'var(--fgColor-muted)'}}
          >
            Add GIF
          </span>
        </span>
      </a>
      <div
        ref={scrollContainerReference}
        className='border rounded'
        style={{
          height: '300px',
          overflowY: 'auto',
          display: isShowingGifs ? 'block' : 'none',
          marginBottom: '8px',
        }}
        onScroll={handleScroll}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            zIndex: 1,
            backgroundColor: 'var(--bgColor-default)',
            borderBottom: '1px solid var(--control-borderColor-rest)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            id={addGifInputId}
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Search GIFs...'
            style={{
              position: 'sticky',
              top: 0,
              width: '100%',
              zIndex: 1,
              backgroundColor: 'transparent',
              border: '0',
              boxShadow: 'var(--shadow-inset)',
              color: 'var(--fgColor-default)',
              padding: '5px 12px',
              fontSize: '14px',
              lineHeight: '20px',
              outline: 'none',
            }}
          />
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              alignSelf: 'stretch',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src={giphyLogo}
              style={{
                height: '15px',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
            />
          </div>
        </div>
        {errorMessage && (
          <div
            style={{
              backgroundColor: 'var(--fgColor-danger)',
              color: 'white',
              padding: '5px',
            }}
          >
            Error: {errorMessage}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            padding: '8px',
          }}
        >
          {gifs.map(gif => (
            <GifThumbnail
              gif={gif}
              key={gif.id}
              onClick={() => appendGifMarkdown(gif)}
            />
          ))}
        </div>
        {isShowingLoadingIndicator && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <Loader />
          </div>
        )}
        {!hasMore && gifs.length > 0 && !isShowingLoadingIndicator && (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              color: 'var(--fgColor-muted)',
              fontSize: '14px',
            }}
          >
            All done
          </div>
        )}
      </div>
    </>
  );
};

export default GifButton;
