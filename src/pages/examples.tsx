import React, { useState, useEffect } from 'react';
import { graphql } from "gatsby";
import WrapperLayout from '../components/layout';
import { Layout, Menu, Popover } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import Media from 'react-media';
import './examples.less';
import Playground from '../components/Playground';

const { Sider, Content } = Layout;

export default function Examples(props: any) {
  const { nodes } = props.data.allPlayground;

  const [name, setName] = useState('pbr-helmet');
  const [menuVisible, toggleMenu] = useState(false);

  const groups: any = {};

  let selectNode;

  nodes.forEach((node: any) => {
    const { category } = node;
    if (category) {
      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(node);
    }

    if (node.name === name) {
      selectNode = node;
    }
  });

  const itemGroups = []

  Object.keys(groups).forEach((category) => {
    const groupNodes = groups[category];
    itemGroups.push(<Menu.ItemGroup key={category} title={category}>
      {groupNodes.map((node) => {
        return <Menu.Item key={node.name}>
          {node.title}
        </Menu.Item>
      })}
    </Menu.ItemGroup>)
  })

  const menu = <Menu selectedKeys={[name]} onSelect={(item) => {
    setName(item.key);
    window.history.pushState(null, null, `#${item.key}`);
    toggleMenu(false);
  }} style={{ width: '300px!important', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
    {itemGroups}
  </Menu>


  let sourceCode = '';
  let formatedCode = '';

  if (selectNode) {
    sourceCode = selectNode.sourceCode;
    formatedCode = selectNode.formatedCode;
  }

  useEffect(() => {
    const { hash } = window.location;

    if (hash) {
      setName(hash.replace('#', '') || 'pbr-helmet');
    }
  }, []);

  return (
    <>
      <WrapperLayout {...props} showVersion="true">
        <Media query="(max-width: 599px)">
          {(isMobile) =>
            <Layout hasSider={true}>
              {!isMobile && <Sider>{menu}</Sider>}
              <Content style={{ height: 'calc(100vh - 64px)' }} className="examples-content">
                {isMobile &&
                  <Popover
                    className="examples-popover-menu"
                    placement="bottomRight"
                    content={menu}
                    trigger="click"
                    visible={menuVisible}
                    arrowPointAtCenter
                  >
                    <MenuUnfoldOutlined className="nav-phone-icon" onClick={() => { toggleMenu(!menuVisible) }} />
                  </Popover>
                }
                <Playground name={name} sourceCode={sourceCode} formatedCode={formatedCode}></Playground>
              </Content>
            </Layout>
          }
        </Media>
      </WrapperLayout>
    </>
  );
}

export const query = graphql`
  query {
    allPlayground {
      nodes {
        internal {
          content
        }
        name
        title
        category
        id
        sourceCode 
        formatedCode 
      }
    }
  }
`;