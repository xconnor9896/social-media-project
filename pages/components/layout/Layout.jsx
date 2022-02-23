import HeadTag from "./HeadTag";
import Navbar from "./Navbar";
import { Container, Grid, Ref, Visibility, Sticky } from "semantic-ui-react";
import Router from 'next/router';
import nProgress from "nprogress";
import { createRef } from 'react';
import SideMenu from "./SideMenu";
import SearchComponent from "./SearchComponent";

const Layout = ({ children, user }) => {
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  //createRef refreshes on render, useRef refereshes on page refresh
  const contextRef = createRef();

  return (
    <>
      <HeadTag />
      {user ? (
        <>
          <div style={{ marginLeft: "1rem", marginRight: "1rem", marginTop: "2rem" }}>
            <Ref innerRef={contextRef}>
              <Grid>
                <Grid.Column width={2}>
                  <Sticky context={contextRef}>
                    <SideMenu user={user} />
                  </Sticky>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Visibility context={contextRef}>
                    {children}
                  </Visibility>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Sticky context={contextRef}>
                    <SearchComponent />
                  </Sticky>
                </Grid.Column>
              </Grid>
            </Ref>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <Container text style={{ paddingTop: "1rem" }}>
            {children}
          </Container>
        </>
      )
      }
    </>
  );
};

export default Layout;
