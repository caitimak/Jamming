let accessToken;
const clientID = '448cf5db28d549d9b0d8fd3910a04a94';
const redirectURI = "https://playlister.surge.sh";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenArray = window.location.href.match(/access_token=([^&]*)/);
    const expiresInArray = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenArray && expiresInArray) {
      accessToken = accessTokenArray[1];
      const expiresIn = Number(expiresInArray[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    console.log(accessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      //throw new Error('Request failed!');
      //, networkError => console.log(networkError.message)
    }).then(jsonResponse => {
      //code to execture with jsonResponse
      console.log(`jsonResponse = ${jsonResponse.tracks.items[0].name}`)
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs.length) {
      return;
    }
    let accessToken = Spotify.getAccessToken();
    let headers = {Authorization: `Bearer ${accessToken}`};
    let userID;
    let playlistID;
    console.log(`Tracks = ${trackURIs}`);


    return fetch('https://api.spotify.com/v1/me', {headers: headers}
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed!');
  }, networkError => {
    console.log(networkError.message);
  }).then(jsonResponse => {
    userID = jsonResponse.id;

    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({name: playlistName})
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      playlistID = jsonResponse.id;


    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({uris: trackURIs})
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      playlistID = jsonResponse.id;
    });
  });
  });

  }
};

export default Spotify;
