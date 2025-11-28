const GifThumbnail = ({gif, onClick}) => (
  <button
    onClick={onClick}
    style={{
      aspectRatio: '1/1',
      cursor: 'pointer',
      overflow: 'hidden',
      borderRadius: '3px',
      border: '1px solid var(--fgColor-muted)',
    }}
  >
    <img
      src={gif.blobUrl}
      alt='GIF'
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  </button>
);

export default GifThumbnail;
