import BaseModule from './structures/module/BaseModule.js'
import SpotifyAPI from './structures/api/SpotifyAPI.js'
import SpotifyTrack from './structures/track/SpotifyTrack.js'
import { HostNames } from './util/Constants.js'

export default class TrackSpotify extends BaseModule {
    /**
     * @param {Main} main
     */
    constructor(main) {
        super(main);

        this.register(TrackSpotify, {
            name: 'trackSpotify',
            requires: ['trackResolver']
        });
    }

    /**
     * @private
     * @param {string} pathname
     */
    async _resolve(pathname) {
        if (pathname.includes('/track/')) {
            return new SpotifyTrack(this._m, (await this.spotify.getTrack(pathname.split('/track/')[1])).body);
        }

        const isAlbum = pathname.includes('/album/');
        const data = isAlbum
            ? (await this.spotify.getAlbum(pathname.split('/album/')[1])).body
            : (await this.spotify.getPlaylist(pathname.split('/playlist/')[1])).body;

        const trackList = [];

        data.tracks.items.forEach((item) => trackList.push(new SpotifyTrack(this._m, isAlbum ? item : item.track, isAlbum ? data.images[0].url : null)));

        this._m.emit(isAlbum ? 'albumPlayed' : 'playlistPlayed');

        return trackList;
    }

    init() {
        this.spotify = new SpotifyAPI(this._m, this.auth.credentials.api.spotify);

        this.modules.trackResolver.registerResolver(this.name, HostNames);

        return true;
    }

    /**
     * @param {URL} url
     */
    resolve(url) {
        return this._resolve(url.pathname);
    }
}
