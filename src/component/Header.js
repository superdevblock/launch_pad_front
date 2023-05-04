import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
// import { LinkContainer } from 'react-router-bootstrap';

import Connect from "./Connect";

const StyledNavbar = styled(Navbar)`
  padding-top: 35px;
  width: 100%;
`;

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <StyledNavbar expand='lg'>
      <Container>
        <Navbar.Brand>
          <Link to='/'>
            <div className='d-flex align-items-center'>
              <img
                src={require("../images/logo.png").default}
                alt='Brand Logo'
                width='150px'
                className='mr-2'
              />
            </div>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle className='white-toggle' onClick={toggleMenu} />
        <Navbar.Collapse
          className={`justify-content-center ${showMenu ? "show" : ""}`}
        >
          <Nav>
            <NavDropdown
              title='BDAI'
              id='basic-nav-dropdown'
              style={{ color: "white !important" }}
            >
              <NavDropdown.Item as={Link} to='/presale'>
                Create Raise
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/token'>
                Create Token
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/sale-list'>
                Launchpad List
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title='Locker'
              id='basic-nav-dropdown'
              style={{ color: "white !important" }}
            >
              <NavDropdown.Item as={Link} to='/lock'>
                Create Lock
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/token-locked'>
                Token
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/liquidity-locked'>
                Liquidity
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href='#' target='_blank'>
              WhitePaper
            </Nav.Link>

            {showMenu && <Connect mobile={true} />}
          </Nav>
        </Navbar.Collapse>
        <Connect mobile={false} />
      </Container>
    </StyledNavbar>
  );
};

export default Header;
