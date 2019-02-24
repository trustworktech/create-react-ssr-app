/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('getting-started')}>Get Started</Button>
            <Button href="https://www.github.com/trustworktech/create-react-ssr-app">
              GitHub
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Why = () => (
      <Block layout="twoColumn">
        {[
          {
            title: 'Performance benefit',
            content:
              'Server side rendering decreases initial page load time, bringing relevant content to your users faster.',
          },
          {
            title: 'Consistent SEO',
            content:
              'Server side rendering makes it easier for google to crawl your website, resulting in better SEO performance.',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block background="light" layout="threeColumn">
        {[
          {
            title: 'Less to Learn',
            content:
              "You don't need to learn and configure many build tools. Instant reloads help you focus on development. When it's time to deploy, your bundles are optimized automatically.",
          },
          {
            title: 'Only One Dependency',
            content:
              'Your app only needs one build dependency. We test Create React SSR App to make sure that all of its underlying pieces work together seamlessly – no complicated version mismatches.',
          },
          {
            title: 'No Lock-In',
            content:
              'Under the hood, we use Webpack, Babel, ESLint, and other amazing projects to power your app. If you ever want an advanced configuration, you can ”eject” from Create React SSR App and edit their config files directly.',
          },
        ]}
      </Block>
    );

    const GetStarted = () => (
      <Block layout="twoColumn">
        {[
          {
            title: 'Get started in seconds',
            content: `Whether you’re using React or another library, Create React SSR App lets you **focus on code, not build tools**.
    To create a project called \`my-app\`, run this command:

    npx create-react-ssr-app my-app
    `,
          },
          {
            title: 'Easy to maintain',
            content: `Updating your build tooling is typically a daunting and time-consuming task. When new versions of Create React SSR App are released, you can upgrade using a single command:
    
    npm install react-ssr-scripts@latest
    `,
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Why />
          <Features />
          <GetStarted />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
