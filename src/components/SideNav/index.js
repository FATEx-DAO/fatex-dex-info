import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Title from '../Title'
import { BasicLink } from '../Link'
import { useMedia } from 'react-use'
import { transparentize } from 'polished'
import { TYPE } from '../../Theme'
import { withRouter } from 'react-router-dom'
import { TrendingUp, List, PieChart, Disc } from 'react-feather'
import Link from '../Link'
import { useSessionStart } from '../../contexts/Application'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import Toggle from '../Toggle'
import theme from '../../Theme'
import TwitterLogo from '../../assets/twitter-logo.svg'
import RedditLogo from '../../assets/reddit-logo.svg'
import MediumLogo from '../../assets/medium-logo.svg'
import TelegramLogo from '../../assets/telegram-logo.svg'
import DiscordLogo from '../../assets/discord-logo.svg'
import YouTubeLogo from '../../assets/youtube-logo.svg'
import DiscourseLogo from '../../assets/discourse-logo.svg'

const Wrapper = styled.div`
  height: ${({ isMobile }) => (isMobile ? 'initial' : '100vh')};
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  position: sticky;
  top: 0px;
  z-index: 9999999;
  box-sizing: border-box;
  /* background-color: #1b1c22; */

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    position: relative;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
  }
`

const Option = styled.div`
  font-weight: 500;
  font-size: 14px;
  opacity: ${({ activeText }) => (activeText ? 1 : 0.6)};
  color: ${({ theme }) => theme.text1};
  display: flex;
  :hover {
    opacity: 1;
  }
`

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

const MobileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderText = styled.div`
  margin-right: 0.75rem;
  font-size: 0.825rem;
  font-weight: 500;
  display: inline-box;
  display: -webkit-inline-box;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: ${({ theme }) => theme.text1};
  }
`

const Polling = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  padding: 1rem;
  color: white;
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }
`
const PollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-right: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};
`

const SocialLinks = styled.div`
  margin-top: 10px;
  max-width: 75%;

  a {
    display: inline-block;
    margin: 5px;

    img,
    svg {
      filter: invert(${(props) => (props.isDark ? '1' : '0')});
      width: 20px;
      opacity: 0.6;

      :hover {
        opacity: 1;
      }
    }
  }
`

function SideNav({ history }) {
  const below1080 = useMedia('(max-width: 1080px)')

  const below1180 = useMedia('(max-width: 1180px)')

  const seconds = useSessionStart()

  const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <Wrapper isMobile={below1080}>
      {!below1080 ? (
        <DesktopWrapper>
          <AutoColumn gap="1rem" style={{ marginLeft: '.75rem', marginTop: '1.5rem' }}>
            <Title />
            {!below1080 && (
              <AutoColumn gap="1.25rem" style={{ marginTop: '1rem' }}>
                <BasicLink to="/home">
                  <Option activeText={history.location.pathname === '/home' ?? undefined}>
                    <TrendingUp size={20} style={{ marginRight: '.75rem' }} />
                    Overview
                  </Option>
                </BasicLink>
                <BasicLink to="/tokens">
                  <Option
                    activeText={
                      (history.location.pathname.split('/')[1] === 'tokens' ||
                        history.location.pathname.split('/')[1] === 'token') ??
                      undefined
                    }
                  >
                    <Disc size={20} style={{ marginRight: '.75rem' }} />
                    Tokens
                  </Option>
                </BasicLink>
                <BasicLink to="/pairs">
                  <Option
                    activeText={
                      (history.location.pathname.split('/')[1] === 'pairs' ||
                        history.location.pathname.split('/')[1] === 'pair') ??
                      undefined
                    }
                  >
                    <PieChart size={20} style={{ marginRight: '.75rem' }} />
                    Pairs
                  </Option>
                </BasicLink>

                <BasicLink to="/accounts">
                  <Option
                    activeText={
                      (history.location.pathname.split('/')[1] === 'accounts' ||
                        history.location.pathname.split('/')[1] === 'account') ??
                      undefined
                    }
                  >
                    <List size={20} style={{ marginRight: '.75rem' }} />
                    Accounts
                  </Option>
                </BasicLink>
              </AutoColumn>
            )}
          </AutoColumn>
          <AutoColumn gap="0.5rem" style={{ marginLeft: '.75rem', marginBottom: '4rem' }}>
            <HeaderText>
              <Link href="https://github.com/FATEx-DAO" target="_blank">
                Code
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://app.fatex.io" target="_blank">
                FATExDEX
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://gov.daodiscourse.fatex.io/categories" target="_blank">
                DAO Forum
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://fatexdao.gitbook.io/fatexdao/" target="_blank">
                Green Paper
              </Link>
            </HeaderText>
            <SocialLinks isDark={isDark}>
              <a href={'https://www.twitter.com/FATExDAO'} target={'_blank'} rel="noreferrer">
                <img src={TwitterLogo} alt={'twitter logo'} />
              </a>
              <a href={'https://www.reddit.com/r/FATExDAO'} target={'_blank'} rel="noreferrer">
                <img src={RedditLogo} alt={'reddit logo'} />
              </a>
              <a href={'https://fatexdao.medium.com'} target={'_blank'} rel="noreferrer">
                <img src={MediumLogo} alt={'medium logo'} />
              </a>
              <a href={'https://t.me/FATExDAO'} target={'_blank'} rel="noreferrer">
                <img src={TelegramLogo} alt={'telegram logo'} />
              </a>
              <a href={'https://discord.gg/uA6xrmsRfu'} target={'_blank'} rel="noreferrer">
                <img src={DiscordLogo} alt={'discord logo'} />
              </a>
              <a href={'https://youtube.com/channel/UCvD3ItDf063xc_I4412wXCg'} target={'_blank'} rel="noreferrer">
                <img src={YouTubeLogo} alt={'youtube logo'} />
              </a>
              <a href={'https://gov.daodiscourse.fatex.io/categories'} target={'_blank'} rel="noreferrer">
                <img src={DiscourseLogo} alt={'discourse logo'} />
              </a>
            </SocialLinks>
            <Toggle isActive={isDark} toggle={toggleDarkMode} />
          </AutoColumn>
          {!below1180 && (
            <Polling style={{ marginLeft: '.5rem' }}>
              <PollingDot />
              <a href="/" style={{ color: theme.text1 }}>
                <TYPE.small color={theme.text1}>
                  Updated {!!seconds ? seconds + 's' : '-'} ago <br />
                </TYPE.small>
              </a>
            </Polling>
          )}
        </DesktopWrapper>
      ) : (
        <MobileWrapper>
          <Title />
        </MobileWrapper>
      )}
    </Wrapper>
  )
}

export default withRouter(SideNav)
