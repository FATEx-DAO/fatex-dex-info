import React from 'react'
import { Flex } from 'rebass'

import styled from 'styled-components'

import Link from '../Link'

const links = [
  { url: 'https://fatexfi.io', text: 'About' },
  { url: 'https://fatexdao.gitbook.io/fatexdao', text: 'Docs' },
  { url: 'https://github.com/FATEx-DAO', text: 'Code' },
]

const FooterLink = ({ children, ...rest }) => (
  <Link external color="uniswappink" fontWeight={500} fontSize={12} mr={'8px'} {...rest}>
    {children}
  </Link>
)

const FooterWrapper = styled.div`
  width: calc(100% - 324px);
  margin-top: -63px;
  z-index: 9999;
  position: absolute;
  bottom: 0;
  left: 220px;
  padding: 20px;
  color: ${({ theme }) => theme.text1} !important;
  font-weight: 300;
  font-size: 12px;
  text-align: center;

  @media screen and (max-width: 1080px) {
    width: calc(100% - 40px);
    left: 0;
  }
`

const Footer = () => (
  <FooterWrapper>
    © FATExFi {new Date().getFullYear()}
    <br />
    &quot;FATExFi&quot; and the FATExFi logo are unregistered trademarks owned by the FATExFi. Any unauthorized use is
    expressly prohibited.
  </FooterWrapper>
)

export default Footer
