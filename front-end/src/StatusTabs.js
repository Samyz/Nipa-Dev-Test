import { TabsManager, Tabs, TabPanels, TabPanel } from '@react-md/tabs';
import { Typography } from '@react-md/typography';
import TableList from './TableList';

const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

export default function StatusTabs(props) {
  const tabs = props.status;
  return (
    <TabsManager tabs={tabs} tabsId='basic-usage-tabs'>
      <Tabs />
      <TabPanels>
        {props.status.map((status, index) => {
          return props.data.filter((item) => {
            return item.status === status;
          }).length > 0 ? (
            <TabPanel>
              <TableList
                data={props.data.filter((dataItem) => {
                  console.log(dataItem, dataItem.status === status);
                  return dataItem.status === status;
                })}
              />
            </TabPanel>
          ) : (
            <TabPanel>
              <div className='no-content-text'>No {status} content</div>
            </TabPanel>
          );
        })}
        {/* </TabPanel> */}
        {/* <TabPanel>
          <Typography type="headline-4">Panel 1</Typography>
        </TabPanel>
        <TabPanel>
          <Typography type="headline-4">Panel 2</Typography>
        </TabPanel>
        <TabPanel>
          <Typography type="headline-4">Panel 3</Typography>
        </TabPanel> */}
      </TabPanels>
    </TabsManager>
  );
}
