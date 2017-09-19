import React, { Component } from 'react';

import { Anchor, Box, Grommet, Heading, Text } from 'grommet';

import * as Icons from 'grommet-icons';
import metadata from 'grommet-icons/metadata';

import IconExample from './components/IconExample';
import IconHero from './components/IconHero';
import Footer from './components/Footer';
import Header from './components/Header';
import HeaderFooter from './components/HeaderFooter';
import Gremlin from './components/Gremlin';
import Search from './components/Search';

import { withSmall } from './utils/hocs';

const iconKeys = Object.keys(Icons).filter(
  icon => Icons[icon] && icon !== 'default' && Icons[icon] !== true
);

const theme = {
  global: {
    colors: {
      darkBackgroundTextColor: '#FFFFFF',
    },
  },
};

class App extends Component {
  state = {
    iconName: iconKeys[Math.floor(Math.random() * iconKeys.length)],
    search: '',
  }

  componentDidMount() {
    this.changeIconInterval = setInterval(() => {
      this.setState({ iconName: iconKeys[Math.floor(Math.random() * iconKeys.length)] });
    }, 5000); // 5 seconds
  }

  componentWillUnmount() {
    if (this.changeIconInterval) {
      clearTimeout(this.changeIconInterval);
      this.changeIconInterval = undefined;
    }
  }

  render() {
    const { small } = this.props;
    const { iconName, search } = this.state;
    let iconsNode = iconKeys
      .filter(icon => (
        icon.toLowerCase().match(search.toLowerCase()) ||
        (metadata[icon] || []).some(synonym => synonym.toLowerCase().match(search.toLowerCase()))
      ));

    iconsNode = iconsNode.map((icon, index) => {
      const Icon = Icons[icon];
      const label = search ? icon.replace(
          new RegExp(search, 'ig'), text => (text ? `<strong>${text}</strong>` : '')
        ) : icon;
      return (
        <Box
          basis={small ? 'xsmall' : 'small'}
          justify='start'
          align='center'
          pad={{ vertical: 'small' }}
          key={`icon_${index}`}
          style={{ minHeight: small ? '162px' : '144px' }}
        >
          <Icon size='large' color='plain' />
          <Text textAlign='center' margin='small' style={{ wordBreak: 'break-all' }}>
            <span dangerouslySetInnerHTML={{ __html: label }} />
          </Text>
        </Box>
      );
    });

    if (iconsNode.length === 0) {
      const anchorNode = (
        <Anchor target='_blank' href='https://github.com/grommet/grommet-icons/issues/new'>
          issue
        </Anchor>
      );
      iconsNode = (
        <Box align='center'>
          <Heading level={3} margin='none'>No icon, sorry!</Heading>
          <Text textAlign='center' margin='small'>
            If you believe this icon should exist in our library,
            please file an {anchorNode} and we will look into it.
          </Text>
          <Box pad={{ top: 'medium' }}>
            <Gremlin />
          </Box>
        </Box>
      );
    }

    return (
      <Grommet theme={theme}>
        <Box background='brand'>
          <Header />
          <IconHero />
          <HeaderFooter />
        </Box>
        <IconExample name={iconName} icon={Icons[iconName]} />
        <Box align='center' pad={{ horizontal: 'medium' }}>
          <Heading textAlign='center'>Looking for something in particular?</Heading>
        </Box>
        <Box justify='center' direction='row' pad={{ horizontal: 'medium', vertical: 'small' }}>
          <Search
            value={search}
            placeholder={`Search ${iconKeys.length} icons (e.g. social, delete, user)`}
            onInput={event => this.setState({ search: event.target.value, currentPage: 1 })}
          />
        </Box>
        <Box justify='center' direction='row' pad={{ top: 'medium' }}>
          <Box basis='xlarge' wrap={true} direction='row' align='center' justify='center'>
            {iconsNode}
          </Box>
        </Box>
        <Footer />
      </Grommet>
    );
  }
}

export default withSmall(App);
