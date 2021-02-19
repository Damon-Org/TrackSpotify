import ResolvableTrack from './ResolvableTrack.js'

export default class SpotifyTrack extends ResolvableTrack {
    /**
     * @param {Main} main
     * @param {Object} data
     * @param {string} [image=null] URL of the image
     */
    constructor(main, data, image = null) {
        super(main);

        Object.assign(this, {
            artists: data.artists,
            cover: image ? image : data.album?.images[0]?.url,
            name: data.name
        });
    }

    get author() {
        return this.artists[0].name;
    }

    get full_author() {
        const authors = [];

        this.artists.forEach((artist) => authors.push(artist.name));

        return authors.join(', ');
    }

    get title() {
        return this.author +' - '+ this.name;
    }

    get image() {
        return this.cover;
    }
}
