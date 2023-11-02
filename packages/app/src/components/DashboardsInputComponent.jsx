import React, { useEffect, useRef, useState } from 'react';
import Search from '@splunk/react-ui/Search';
import FetchOptions from '../FetchOptions';
import styled from 'styled-components';



function DashboardsInputComponent({ onSearchChange, onPermsData  }) {

    const fetchOptions = useRef(new FetchOptions());
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');

    // const handleFetch = (searchValue = '') => {
    //     setValue(searchValue);
    //     setIsLoading(true);
    //     fetchOptions.current
    //         .fetch(searchValue)
    //         .then((searchOptions) => {
    //             setIsLoading(false);
    //             setOptions(searchOptions);
    //         })
    //         .catch((error) => {
    //             if (!error.isCanceled) {
    //                 throw error;
    //             }
    //         });
    // };
    const handleFetch = (searchValue = "") => {
        setValue(searchValue);
        setIsLoading(false);
        const searchOptions = {
        "links": {
            "create": "/servicesNS/admin/-/data/ui/views/_new",
            "_reload": "/servicesNS/admin/-/data/ui/views/_reload",
            "_acl": "/servicesNS/admin/-/data/ui/views/_acl"
        },
        "origin": "https://0.0.0.0:8089/servicesNS/admin/-/data/ui/views",
        "updated": "2023-10-30715:18:57+00:00",
        "generator": {
        "build": "64e843ea36b1",
        "version": "9.1.1"
        },
        "entry": [
            {
                "name": "administration",
                "id": "https://0.0.0.0:8089/servicesNS/nobody/splunk secure gateway/data/ui/views/adm",
                "updated": "1970-01-01T00:00:00+00:00",
                "Links": {
                    "alternate": "/servicesNS/nobody/splunk_secure_gatewáy/data/ui/views/administratic",
                    "list": "/servicesNS/nobody/splunk_secure_gateway/data/ui/views/administration",
                    "_reload": "/servicesNS/nobody/splunk_secure_gateway/data/ui/views/administration",
                    "edit": "/servicesNS/nobody/splunk_secure_gateway/data/ui/views/administration",
                },
        "author": "nobody",
        "acl": {
            "app": "splunk_secure_gateway",
            "can_change_perms": true,
            "can_list": true,
            "can_share_app": true,
            "can_share_global": true,
            "can_share_user": false,
            "can_write": true,
            "modiflable": true,
            "owner": "nobody",
            "perms": {
                "read": ["admin", "sc_admin"],
                "write": ["admin", "sc_admin" ]
            },
            "removable": false,
            "sharing": "app",
        },
        content:{
        }
    }
    ]
    };
    //console.log("search value: " + searchValue);
    // Initialize permissions data
    const permsData = {};

    // Find the selected dashboard entry
    const selectedDashboard = searchOptions.entry.find((dashboard) => dashboard.name === searchValue);
    // If a dashboard with matching name is found, set the permissions data
    if (selectedDashboard) {
       // console.log("selectedDashboard: " + JSON.stringify(selectedDashboard.acl.perms.read));
        permsData[selectedDashboard.name] = {
            read: selectedDashboard.acl?.perms?.read,
            write: selectedDashboard.acl?.perms?.write,
        };
        onPermsData(permsData);
    }
    
    setOptions(searchOptions.entry);
    
};


    const generateOptions = () => {
        if (isLoading) {
            return null;
        }

        return options.map((dash) => <Search.Option value={dash.name} key={dash.id} />);
    };

    const handleChange = (e, { value: searchValue }) => {
        handleFetch(searchValue);
        onSearchChange(searchValue);
        if (searchValue === '') {
            onSearchChange('');
          }
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

export default DashboardsInputComponent;