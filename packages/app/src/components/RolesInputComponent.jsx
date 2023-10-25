import React, { useEffect, useRef, useState } from 'react';
import Search from '@splunk/react-ui/Search';
import FetchOptions from '../FetchOptions';

function RolesInputComponent({ onSearchChange }) {
    /**
     * FetchOptions mimics a real server by setting a timeout before returning new options.
     */
    const fetchOptions = useRef(new FetchOptions());
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');

    const handleFetch = (searchValue = '') => {
        setValue(searchValue);
        setIsLoading(true);
        fetchOptions.current
            .fetch(searchValue)
            .then((searchOptions) => {
                setIsLoading(false);
                setOptions(searchOptions);
            })
            .catch((error) => {
                if (!error.isCanceled) {
                    throw error;
                }
            });
    };

    const generateOptions = () => {
        if (isLoading) {
            return null;
        }

        return options.map((movie) => <Search.Option value={movie.title} key={movie.id} />);
    };

    const handleChange = (e, { value: searchValue }) => {
        handleFetch(searchValue);
    };

    useEffect(() => {
        handleFetch();
        const fetchOptionsRef = fetchOptions.current;

        return () => {
            fetchOptionsRef.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const searchOptions = generateOptions();

    return (
        <Search value={value} inline onChange={handleChange} isLoadingOptions={isLoading}>
            {searchOptions}
        </Search>
    );
}

export default RolesInputComponent;