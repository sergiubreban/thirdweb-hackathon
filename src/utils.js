
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match?.(regExp);

  if (match && match?.[2]?.length === 11) {
    return match[2];
  } else {
    return null;
  }
}
const genres = ['Hip Hop', 'Rock', 'Reggae', 'Country', 'Funk', 'Soul', 'Blues', 'electronic', 'Pop', 'Jazz', 'Disco', 'Vocal', 'Traditional']

const jsonParser = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return {}
  }
}

export { shortenAddress, getYoutubeId, genres, jsonParser }