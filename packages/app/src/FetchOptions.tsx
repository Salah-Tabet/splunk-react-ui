import 'core-js/es/promise';
import { find, concat } from 'lodash';
import { CancelablePromise, makeCancelable } from '@splunk/ui-utils/promise';
import moviesJson from './movies.json';

type Movie = { id: number; title: string };
type MovieOption = Movie & { matchRanges?: { start: number; end: number }[] };
function isMovieOption(movie: Movie | MovieOption): movie is MovieOption {
    return (movie as MovieOption).matchRanges !== undefined;
}

// Webpack 5 doesn't work well with "import { movies } from './movies.json';" so destructure here
const { movies }: { movies: Movie[] } = moviesJson;

/**
 * @param fetchTimeout: number - The number of milliseconds to defer fetching of options.
 * @param fetchMoreTimeout: number - The number of milliseconds to defer fetching additional options.
 * @param numberOfResults: number - Then mumber of options to retrieve per fetch.
 */
export default class FetchOptions {
    private currentFetch: number;

    private currentOptions: MovieOption[];

    private fetching: boolean;

    private fetchMoreTimeout: number;

    private fetchPromise?: CancelablePromise<MovieOption[]>;

    private fetchTimeout: number;

    private filter?: string;

    private firstIndex: number;

    private lastIndex: number;

    private list: MovieOption[];

    private numberOfResults: number;

    private timer?: ReturnType<typeof setTimeout>;

    constructor({ fetchTimeout = 600, fetchMoreTimeout = 200, numberOfResults = 20 } = {}) {
        this.currentFetch = 0;
        this.currentOptions = [];
        this.fetching = false;
        this.fetchMoreTimeout = fetchMoreTimeout;
        this.fetchTimeout = fetchTimeout;
        this.filter = '';
        this.firstIndex = 0;
        this.lastIndex = 0;
        this.list = [];
        this.numberOfResults = numberOfResults;
        this.reset();
    }

    /**
     * Fake fetches options from a server.
     * @param filter: string - filter options.
     * @param timeout: number - Number of milliseconds to defer fetch.
     * @return A promise that will resolve based on the fetchTimeout value.
     *         Returns array of new options.
     */
    fetch(filter?: string, timeout = this.fetchTimeout) {
        if (!this.list.length || this.filter !== filter) {
            this.reset();
        }
        this.filter = filter;

        // If currently fetching, add timeout of previous fetch to current timeout
        if (this.fetching) {
            this.currentFetch += timeout;
        } else {
            this.currentFetch = timeout;
        }
        this.fetching = true;

        this.fetchPromise = makeCancelable(
            new Promise((resolve) => {
                this.timer = setTimeout(() => {
                    this.fetching = false;
                    this.list = this.concatAndFilter(this.currentOptions, this.filter);
                    if (this.timer !== undefined) {
                        clearTimeout(this.timer);
                    }
                    return resolve(this.list);
                }, this.currentFetch);
            })
        );
        return this.fetchPromise.promise;
    }

    /**
     * Increases searching index for new options and runs fetch.
     * @param currentOptions: array - Append options to given array.
     * @return A promise that will resolve based on the fetchTimeout value.
     *         Returns array of new options appended to currentOptions.
     */
    fetchMore(currentOptions: MovieOption[] = []) {
        this.currentOptions = currentOptions;
        this.firstIndex += this.numberOfResults;
        this.lastIndex += this.numberOfResults;
        return this.fetch(this.filter, this.fetchMoreTimeout);
    }

    private concatAndFilter = (options: MovieOption[], filter?: string): MovieOption[] => {
        const newOptions: MovieOption[] = this.filterResults(filter)
            .slice(this.firstIndex, this.lastIndex)
            .map((movie) => ({
                title: movie.title,
                id: movie.id,
                matchRanges:
                    filter === undefined
                        ? undefined
                        : [
                              {
                                  start: 0,
                                  end: filter.length,
                              },
                          ],
            }));

        return concat(options, newOptions);
    };

    private filterResults = (filter?: string) => {
        if (filter === undefined) {
            return movies;
        }

        return movies.filter(
            (movie) => movie.title.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
    };

    /**
     * Resets firstIndex, LastIndex, currentOptions and list to default values.
     */
    reset() {
        this.firstIndex = 0;
        this.lastIndex = this.numberOfResults;
        this.currentOptions = [];
        this.list = [];
    }

    /** Cancels pending fetch promises. */
    stop() {
        this.fetchPromise?.cancel();
    }

    /**
     * @return Option of given value;
     */
    getOption = (value: number) => find(movies, (movie) => movie.id === value);

    /**
     * @return Options of given values;
     */
    getSelectedOptions = (values: number[]) =>
        movies.filter((movie) => !!find(values, (value) => movie.id === value));

    /**
     * Get current length of indexes fetched.
     */
    getCurrentCount = () => this.list.length;

    /**
     * Get full count of all possible items fetched.
     */
    getFullCount = () =>
        this.filter ? this.filterResults(this.filter || '').length : movies.length;
}

export { isMovieOption, Movie, MovieOption };
