import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

import Row, { RowFixed } from '../Row'
import TokenLogo from '../TokenLogo'
import { Search as SearchIcon, X } from 'react-feather'
import { BasicLink } from '../Link'

import { useAllTokenData, useTokenData } from '../../contexts/TokenData'
import { useAllPairData, usePairData } from '../../contexts/PairData'
import DoubleTokenLogo from '../DoubleLogo'
import { useMedia } from 'react-use'
import { useAllPairsInUniswap, useAllTokensInUniswap } from '../../contexts/GlobalData'
import { TOKEN_BLACKLIST, PAIR_BLACKLIST } from '../../constants'

import { client } from '../../apollo/client'
import { PAIR_SEARCH, TOKEN_SEARCH } from '../../apollo/queries'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { updateNameData } from '../../utils/data'
import theme from '../../Theme'

const Container = styled.div`
  height: 48px;
  z-index: 30;
  position: relative;
  background: ${({ theme }) => theme.bg6};
  border-radius: 8px;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 30px;
  border-radius: 8px;
  background: ${({ theme, small, open }) => (small ? (open ? theme.bg6 : 'none') : theme.bg6)};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '8px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '8px')};
  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  @media screen and (max-width: 650px) {
    padding: 16px 16px;
  }
  @media screen and (max-width: 500px) {
    background: ${({ theme }) => theme.bg6};
  }
`
const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.text6};
  font-size: ${({ large }) => (large ? '18px' : '14px')};
  font-weight: 400;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchIconLarge = styled(SearchIcon)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: ${({ theme }) => theme.text3};
`

const CloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 50px;
  max-height: 540px;
  overflow: auto;
  left: 0;
  padding-bottom: 10px;
  background: ${({ theme }) => theme.bg6};
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
    0px 24px 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => hide && 'none'};

  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.bg5};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.bg4};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.bg3};
  }
`

const MenuItem = styled(Row)`
  padding: 1rem 30px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text6};
  font-weight: 500;

  > div {
    font-weight: 500;
    color: ${({ theme }) => theme.text6};
  }

  > div > div {
    color: ${({ theme }) => theme.text6};
    font-weight: 500;
  }

  > div > div > div {
    color: ${({ theme }) => theme.text6};
    font-weight: 500;
  }

  & > * {
    margin-right: 6px;
  }
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg5};
  }

  @media screen and (max-width: 650px){
    padding: 1rem;
  }
`

const Heading = styled(Row)`
  padding: 1rem 30px;
  display: ${({ hide = false }) => hide && 'none'};

  @media screen and (max-width: 650px){
    padding: 1rem;
  }
`

const Gray = styled.span`
  color: #888d9b;
`

export const Search = ({ small = false }) => {
  let allTokens = useAllTokensInUniswap()
  const allTokenData = useAllTokenData()

  let allPairs = useAllPairsInUniswap()
  const allPairData = useAllPairData()

  const [showMenu, toggleMenu] = useState(false)
  const [value, setValue] = useState('')
  const [, toggleShadow] = useState(false)
  const [, toggleBottomShadow] = useState(false)

  // fetch new data on tokens and pairs if needed
  useTokenData(value)
  usePairData(value)

  const below700 = useMedia('(max-width: 700px)')
  const below470 = useMedia('(max-width: 470px)')
  const below410 = useMedia('(max-width: 410px)')

  useEffect(() => {
    if (value !== '') {
      toggleMenu(true)
    } else {
      toggleMenu(false)
    }
  }, [value])

  const [searchedTokens, setSearchedTokens] = useState([])
  const [searchedPairs, setSearchedPairs] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        if (value?.length > 0) {
          let tokens = await client.query({
            query: TOKEN_SEARCH,
            variables: {
              value: value ? value.toUpperCase() : '',
              id: value,
            },
          })

          let pairs = await client.query({
            query: PAIR_SEARCH,
            variables: {
              tokens: tokens.data.asSymbol?.map((t) => t.id),
              id: value,
            },
          })

          setSearchedPairs(
            updateNameData(pairs.data.as0)
              .concat(updateNameData(pairs.data.as1))
              .concat(updateNameData(pairs.data.asAddress))
          )
          const foundTokens = tokens.data.asSymbol.concat(tokens.data.asAddress).concat(tokens.data.asName)
          setSearchedTokens(foundTokens)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [value])

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  // add the searched tokens to the list if not found yet
  allTokens = allTokens.concat(
    searchedTokens.filter((searchedToken) => {
      let included = false
      updateNameData()
      allTokens.map((token) => {
        if (token.id === searchedToken.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniqueTokens = []
  let found = {}
  allTokens &&
    allTokens.map((token) => {
      if (!found[token.id]) {
        found[token.id] = true
        uniqueTokens.push(token)
      }
      return true
    })

  allPairs = allPairs.concat(
    searchedPairs.filter((searchedPair) => {
      let included = false
      allPairs.map((pair) => {
        if (pair.id === searchedPair.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniquePairs = []
  let pairsFound = {}
  allPairs &&
    allPairs.map((pair) => {
      if (!pairsFound[pair.id]) {
        pairsFound[pair.id] = true
        uniquePairs.push(pair)
      }
      return true
    })

  const filteredTokenList = useMemo(() => {
    return uniqueTokens
      ? uniqueTokens
          .sort((a, b) => {
            const tokenA = allTokenData[a.id]
            const tokenB = allTokenData[b.id]
            if (tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA.oneDayVolumeUSD > tokenB.oneDayVolumeUSD ? -1 : 1
            }
            if (tokenA?.oneDayVolumeUSD && !tokenB?.oneDayVolumeUSD) {
              return -1
            }
            if (!tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA?.totalLiquidity > tokenB?.totalLiquidity ? -1 : 1
            }
            return 1
          })
          .filter((token) => {
            if (TOKEN_BLACKLIST.includes(token.id)) {
              return false
            }
            const regexMatches = Object.keys(token).map((tokenEntryKey) => {
              const isAddress = value.slice(0, 2) === '0x'
              if (tokenEntryKey === 'id' && isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (tokenEntryKey === 'symbol' && !isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (tokenEntryKey === 'name' && !isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              return false
            })
            return regexMatches.some((m) => m)
          })
      : []
  }, [allTokenData, uniqueTokens, value])

  const filteredPairList = useMemo(() => {
    return uniquePairs
      ? uniquePairs
          .sort((a, b) => {
            const pairA = allPairData[a.id]
            const pairB = allPairData[b.id]
            if (pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return parseFloat(pairA.trackedReserveETH) > parseFloat(pairB.trackedReserveETH) ? -1 : 1
            }
            if (pairA?.trackedReserveETH && !pairB?.trackedReserveETH) {
              return -1
            }
            if (!pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return 1
            }
            return 0
          })
          .filter((pair) => {
            if (PAIR_BLACKLIST.includes(pair.id)) {
              return false
            }
            if (value && value.includes(' ')) {
              const pairA = value.split(' ')[0]?.toUpperCase()
              const pairB = value.split(' ')[1]?.toUpperCase()
              return (
                (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
              )
            }
            if (value && value.includes('-')) {
              const pairA = value.split('-')[0]?.toUpperCase()
              const pairB = value.split('-')[1]?.toUpperCase()
              return (
                (pair.token0.symbol.includes(pairA) || pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) || pair.token1.symbol.includes(pairB))
              )
            }
            const regexMatches = Object.keys(pair).map((field) => {
              const isAddress = value.slice(0, 2) === '0x'
              if (field === 'id' && isAddress) {
                return pair[field].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (field === 'token0') {
                return (
                  pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
                )
              }
              if (field === 'token1') {
                return (
                  pair[field].symbol.match(new RegExp(escapeRegExp(value), 'i')) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), 'i'))
                )
              }
              return false
            })
            return regexMatches.some((m) => m)
          })
      : []
  }, [allPairData, uniquePairs, value])

  useEffect(() => {
    if (Object.keys(filteredTokenList).length > 2) {
      toggleShadow(true)
    } else {
      toggleShadow(false)
    }
  }, [filteredTokenList])

  useEffect(() => {
    if (Object.keys(filteredPairList).length > 2) {
      toggleBottomShadow(true)
    } else {
      toggleBottomShadow(false)
    }
  }, [filteredPairList])

  const [tokensShown, setTokensShown] = useState(3)
  const [pairsShown, setPairsShown] = useState(3)

  function onDismiss() {
    setPairsShown(3)
    setTokensShown(3)
    toggleMenu(false)
    setValue('')
  }

  // refs to detect clicks outside modal
  const wrapperRef = useRef()
  const menuRef = useRef()

  const handleClick = (e) => {
    if (
      !(menuRef.current && menuRef.current.contains(e.target)) &&
      !(wrapperRef.current && wrapperRef.current.contains(e.target))
    ) {
      setPairsShown(3)
      setTokensShown(3)
      toggleMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  return (
    <Container small={small}>
      <Wrapper open={showMenu} shadow={true} small={small}>
        <Input
          large={!small}
          type={'text'}
          ref={wrapperRef}
          placeholder={
            small
              ? ''
              : below410
              ? 'Search...'
              : below470
              ? 'Search FATExFi...'
              : below700
              ? 'Search pairs and tokens...'
              : 'Search FATExFi pairs and tokens...'
          }
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onFocus={() => {
            if (!showMenu) {
              toggleMenu(true)
            }
          }}
        />
        {!showMenu ? <SearchIconLarge /> : <CloseIcon onClick={() => toggleMenu(false)} />}
      </Wrapper>
      <Menu hide={!showMenu} ref={menuRef}>
        <Heading>
          <Gray>Pairs</Gray>
        </Heading>
        <div>
          {filteredPairList && Object.keys(filteredPairList).length === 0 && (
            <MenuItem>
              <TYPE.body>No results</TYPE.body>
            </MenuItem>
          )}
          {filteredPairList &&
            filteredPairList.slice(0, pairsShown).map((pair) => {
              //format incorrect names
              updateNameData(pair)
              return (
                <BasicLink to={'/pair/' + pair.id} key={pair.id} onClick={onDismiss}>
                  <MenuItem>
                    <DoubleTokenLogo a0={pair?.token0?.id} a1={pair?.token1?.id} margin={true} />
                    <TYPE.body style={{ marginLeft: '10px' }}>
                      {pair.token0.symbol + '-' + pair.token1.symbol} Pair
                    </TYPE.body>
                  </MenuItem>
                </BasicLink>
              )
            })}
          <Heading
            hide={!(Object.keys(filteredPairList).length > 3 && Object.keys(filteredPairList).length >= pairsShown)}
          >
            <Gray
              onClick={() => {
                setPairsShown(pairsShown + 5)
              }}
              style={{ cursor: 'pointer' }}
            >
              See more...
            </Gray>
          </Heading>
        </div>
        <Heading>
          <Gray>Tokens</Gray>
        </Heading>
        <div>
          {Object.keys(filteredTokenList).length === 0 && (
            <MenuItem>
              <TYPE.body>No results</TYPE.body>
            </MenuItem>
          )}
          {filteredTokenList.slice(0, tokensShown).map((token) => {
            // update displayed names
            updateNameData({ token0: token })
            return (
              <BasicLink to={'/token/' + token.id} key={token.id} onClick={onDismiss}>
                <MenuItem>
                  <RowFixed>
                    <TokenLogo address={token.id} style={{ marginRight: '10px' }} />
                    <FormattedName
                      text={token.name}
                      maxCharacters={20}
                      style={{ marginRight: '6px' }}
                      color={theme.text6}
                    />
                    (<FormattedName text={token.symbol} maxCharacters={6} color={theme.text6} />)
                  </RowFixed>
                </MenuItem>
              </BasicLink>
            )
          })}

          <Heading
            hide={!(Object.keys(filteredTokenList).length > 3 && Object.keys(filteredTokenList).length >= tokensShown)}
          >
            <Gray
              onClick={() => {
                setTokensShown(tokensShown + 5)
              }}
              style={{ cursor: 'pointer' }}
            >
              See more...
            </Gray>
          </Heading>
        </div>
      </Menu>
    </Container>
  )
}

export default Search
