import React, {useState, useEffect} from 'react';
import Dashboard from '@splunk/react-icons/enterprise/Dashboard';
import Button from '@splunk/react-ui/Button';
import Card from '@splunk/react-ui/Card';
import Table from '@splunk/react-ui/Table';
import styled from 'styled-components';
import ControlGroup from "@splunk/react-ui/ControlGroup";
import Switch from "@splunk/react-ui/Switch";

  const CheckboxContainer = styled.div`
    display: flex;
    gap: 30px;
    //margin-right: 10px; // Remove the extra space to the right of checkboxes
  `;
  
  const StyledTableContainer = styled.div`
    width: 100%; 
    max-height: 65vh; 
    overflow-y: auto; 
`;

const StyledPermissionColumn = styled.div`
  width: 30% !important;
  text-align: center;
  display: flex;
  align-items: center;
`;

const StyledRolesColumn = styled.div`
  width: 70% !important;
  text-align: left;
`;

function PrivsTableComponent({ selectedDashboard, onCheckboxChange, isDirty, setIsDirty, initialReadChecked, initialWriteChecked, permsData}) {
    const [checkboxValues, setCheckboxValues] = useState([]); 
    // const [initialReadChecked, setInitialReadChecked] = useState({});
    // const [initialWriteChecked, setInitialWriteChecked] = useState({});
    const [selectAllRead, setSelectAllRead] = useState(false);
    const [selectAllWrite, setSelectAllWrite] = useState(false);
    const [readChecked, setReadChecked] = useState(initialReadChecked);
    const [writeChecked, setWriteChecked] = useState(initialWriteChecked);
    console.log("===>", permsData)
    const [tableData, setTableData] = useState([
        {
            "name": "admin",
            "id": "https://0.0.0.0:8089/services/authorization/roles/admin",
            "updated": "1970-01-01T00:00:00+00:00",
            "links": {
                "alternate": "/services/authorization/roles/admin",
                "list": "/services/authorization/roles/admin",
                "edit": "/services/authorization/roles/admin",
                "remove": "/services/authorization/roles/admin",
            },
            "author": "system",
            "acl": {
                "app":"",
                "can_list": true,
                "can_write": true,
                "modifiable": false,
                "owner": "system",
            },
            "perms": {
                "read":["*"],
                "write":["*"],
                },
            "removable": false,
            "sharing": "system",
        },
        {
            "name": "sc_admin",
            "id": "https://0.0.0.0:8089/services/authorization/roles/admin",
            "updated": "1970-01-01T00:00:00+00:00",
            "links": {
                "alternate": "/services/authorization/roles/admin",
                "list": "/services/authorization/roles/admin",
                "edit": "/services/authorization/roles/admin",
                "remove": "/services/authorization/roles/admin",
            },
            "author": "system",
            "acl": {
                "app":"",
                "can_list": true,
                "can_write": true,
                "modifiable": false,
                "owner": "system",
            },
            "perms": {
                "read":["*"],
                "write":["*"],
                },
            "removable": false,
            "sharing": "system",
        }
        ]);
      const filteredData = tableData; //.filter((row) => row.name === selectedDashboard);
    //   const handleCheckboxChange = (roleId, permissionType) => {
    //     const updatedTableData = tableData.map((row) => {
    //       if (row.id === roleId) {
    //         if (permissionType === 'read') {
    //           row.read = !row.read;
    //           row.status = row.read ? 'Permission read added' : 'Permission read revoked';
    //         } else if (permissionType === 'write') {
    //           row.write = !row.write;
    //           row.status = row.write ? 'Permission write added' : 'Permission write revoked';
    //         }
    //       }
    //       return row;
    //     });
    //     setTableData(updatedTableData);
    //   };
    
    useEffect(() => {
        if (permsData && Object.keys(permsData).length > 0) {
            const initialReadChecked = {};
            const initialWriteChecked = {};
        
            for (const dashboard in permsData) {
                
              if (permsData.hasOwnProperty(dashboard)) {
                for (const role of permsData[dashboard].read) {
                    console.log("()()()(=>",role)
                  if (!initialReadChecked[role]) {
                    initialReadChecked[role] = true;
                  }
                }
        
                for (const role of permsData[dashboard].write) {
                  if (!initialWriteChecked[role]) {
                    initialWriteChecked[role] = true;
                  }
                }
              }
            }
        
            console.log(initialWriteChecked,"===initial==", initialWriteChecked);
            setReadChecked(initialReadChecked);
            setWriteChecked(initialWriteChecked);
        }
      }, [permsData]);
      
    
      const handleSelectAllRead = () => {
        if (selectedDashboard) {
            const updatedReadChecked = { ...readChecked };
        
            filteredData.forEach((row) => {
              updatedReadChecked[row.name] = !selectAllRead;
            });
        
            setReadChecked(updatedReadChecked);
            setSelectAllRead(!selectAllRead);
            setIsDirty(true);
          }
      };
      
      const handleSelectAllWrite = () => {
        if (selectedDashboard) {
            const updatedWriteChecked = { ...writeChecked };
        
            filteredData.forEach((row) => {
              updatedWriteChecked[row.name] = !selectAllWrite;
            });
        
            setWriteChecked(updatedWriteChecked);
            setSelectAllWrite(!selectAllWrite);
            setIsDirty(true);
          }
          
      };

      
    const handleReadCheckboxClick = (role) => {
        if (selectedDashboard) {
            const updatedReadChecked = { ...readChecked };
            updatedReadChecked[role] = !readChecked[role];
            setReadChecked(updatedReadChecked);
        
            const selectedDashboardPerms = permsData[selectedDashboard];
        
            if (selectedDashboardPerms) {
              const isDirty =
                !Object.keys(updatedReadChecked).some((r) => updatedReadChecked[r]) ||
                (selectedDashboardPerms.write &&
                  selectedDashboardPerms.write.some((r) => writeChecked[r]));
              setIsDirty(isDirty);
            }
          }
      };
    
      const handleWriteCheckboxClick = (role) => {
        if (selectedDashboard) {
            const updatedWriteChecked = { ...writeChecked };
            updatedWriteChecked[role] = !writeChecked[role];
            setWriteChecked(updatedWriteChecked);
        
            const selectedDashboardPerms = permsData[selectedDashboard];
        
            if (selectedDashboardPerms) {
              const isDirty =
                (selectedDashboardPerms.read &&
                  selectedDashboardPerms.read.some((r) => readChecked[r])) ||
                !Object.keys(updatedWriteChecked).some((r) => updatedWriteChecked[r]);
              setIsDirty(isDirty);
            }
          }
      };

return (
    <>
      <StyledTableContainer>
      <Table dockoffset={0} stripeRows headType="docked" dockscrollBar>
      <Table.Head>
        <Table.HeadCell style={{ width: '70%' }}>
            <StyledRolesColumn>Roles</StyledRolesColumn>
        </Table.HeadCell>
        <Table.HeadCell style={{ width: '30%' }}>
            <StyledPermissionColumn>
            {/* <span style={{ float: 'left', marginRight: '20px' }}>Read</span>
            <span style={{ float: 'right' }}>Write</span> */}
            <br />
            <label>
                <input
                type="checkbox"
                checked={selectAllRead} // Add state for select all read
                onChange={handleSelectAllRead}
                />
                Read
            </label>
            <br />
            <label>
                <input
                type="checkbox"
                checked={selectAllWrite} // Add state for select all write
                onChange={handleSelectAllWrite}
                />
                Write
            </label>
            </StyledPermissionColumn>
        </Table.HeadCell>
        </Table.Head>
        <Table.Body>
        {selectedDashboard &&
            filteredData.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>
                  <CheckboxContainer>
                    <Switch
                      value="Read"
                      onClick={() => handleReadCheckboxClick(row.name)}
                      selected={readChecked[row.name] || false}
                      appearance="checkbox"
                    >
                      
                    </Switch>
                    <Switch
                      value="Write"
                      onClick={() => handleWriteCheckboxClick(row.name)}
                      selected={writeChecked[row.name] || false}
                      appearance="checkbox"
                    >
                      
                    </Switch>
                  </CheckboxContainer>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
        </Table>
        
    </StyledTableContainer>
    </>
)
}
export default PrivsTableComponent;
