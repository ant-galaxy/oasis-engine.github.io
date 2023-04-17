import {
  createFromIconfontCN, DingtalkOutlined,
  GithubOutlined,
  TwitterOutlined,
  WechatOutlined,
  YuqueOutlined,
  ZhihuOutlined
} from '@ant-design/icons';
import { Flex, styled } from "@galacean/editor-ui";
import React from 'react';
import { FormattedMessage } from 'react-intl';

const Icon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2808716_9ux7aqrqvq9.js', // 在 iconfont.cn 上生成
});

const StyledFooter = styled(Flex, {
  justifyContent: "space-evenly",
  padding: "$8 0",
  borderTop: "1px solid $slate5",
});

const StyledGroup = styled("div", {
  "& h2": {
    lineHeight: 3
  },
  "& ul": {
    fontSize: "$2",
    lineHeight: 1.8,
    "& a": {
      display: "block"
    },
    "& img": {
      marginTop: "$1"
    }
  }
});

const StyledIcon = styled("span", {
  marginRight: "$2"
});

const StyledHeart = styled("span", {
  padding: "0 $1",
  fontSize: "$4"
});

class Footer extends React.Component<{}> {
  render() {
    return (
      <footer>
        <StyledFooter gap="lg" css={{
          '@media (max-width: 768px)': {
            flexDirection: "column",
            textAlign: "center"
          }
        }}>
          <StyledGroup>
            <h2>
              <FormattedMessage id='app.footer.resources' />
            </h2>
            <ul>
              <li>
                <a target='_blank ' href='https://github.com/galacean'>
                  GitHub
                </a>
              </li>
            </ul>
          </StyledGroup>
          <StyledGroup>
            <h2>
              <FormattedMessage id='app.footer.community' />
            </h2>
            <ul>
              <li>
                <a target='_blank' rel='noopener noreferrer' href='https://www.zhihu.com/column/c_1369047387231592448'>
                  <StyledIcon>
                    <ZhihuOutlined />
                  </StyledIcon>
                  <FormattedMessage id='app.community.zhihu' />
                </a>
              </li>
              <li>
                <a target='_blank' rel='noopener noreferrer' href='https://juejin.cn/team/6930507995474313230/posts'>
                  <StyledIcon>
                    <Icon type='icon-juejin' />
                  </StyledIcon>
                  <FormattedMessage id='app.community.juejin' />
                </a>
              </li>
              <li>
                <a target='_blank' rel='noopener noreferrer' href='https://www.yuque.com/oasis-engine/blog'>
                  <StyledIcon>
                    <YuqueOutlined />
                  </StyledIcon>
                  <FormattedMessage id='app.community.yuque' />
                </a>
              </li>
              <li>
                <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/OasisEngine'>
                  <StyledIcon>
                    <TwitterOutlined />
                  </StyledIcon>
                  <FormattedMessage id='app.community.twitter' />
                </a>
              </li>
              <li>
                <div>
                  <StyledIcon>
                    <WechatOutlined />
                  </StyledIcon>
                  <FormattedMessage id='app.footer.wechat' />
                </div>
                <img src='https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*dLIgTJhxjnEAAAAAAAAAAAAAARQnAQ' alt='' />
              </li>
            </ul>
          </StyledGroup>
          <StyledGroup>
            <h2>
              <FormattedMessage id='app.footer.help' />
            </h2>
            <ul>
              <li>
                <a target='_blank' rel='noopener noreferrer' href='https://github.com/galacean/engine/issues'>
                  <StyledIcon>
                    <GithubOutlined />
                  </StyledIcon>
                  <FormattedMessage id='app.footer.issues' />
                </a>
              </li>
              <li>
                <div>
                  <StyledIcon>
                    <DingtalkOutlined />
                  </StyledIcon>
                  <FormattedMessage id='app.footer.dingtalk' />
                </div>
                <img src='https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*f4LWQp4oaqkAAAAAAAAAAAAAARQnAQ' alt='' />
              </li>
            </ul>
          </StyledGroup>
        </StyledFooter>
        <Flex align="both" css={{ padding: "$4", borderTop: "1px solid $slate5", fontSize: "$1" }}>
          Made with <StyledHeart>❤</StyledHeart> by &nbsp;
          <FormattedMessage id='app.footer.company' />
        </Flex>
      </footer>
    );
  }
}

export default Footer;
