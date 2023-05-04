import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import {
  RiTelegramFill,
  RiTwitterFill,
  RiDiscordFill,
  RiFacebookCircleFill,
  RiInstagramFill,
  RiRedditFill,
  RiFacebookFill,
  RiGithubFill,
  RiMediumFill,
} from "react-icons/ri";
import logo from "../images/logo.png";
import styled from "styled-components";

const StyledNav = styled(Nav)`
  justify-content: center;
  padding-right: 10px;
`;

export default function Footer() {
  return (
    <div>
      <footer className='footer-area'>
        <div className='footer-items m-footer-container'>
          <img src={logo} width='150px' alt=''></img>
          <StyledNav>
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
          </StyledNav>
          <div>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://twitter.com/BDAIPAD'
              style={{ paddingRight: "5px" }}
            >
              <RiTwitterFill size={18} />
            </a>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://t.me/BDAIPAD'
              style={{ paddingRight: "5px" }}
            >
              <RiTelegramFill size={18} />
            </a>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://medium.com/@BDAIpad'
            >
              <RiMediumFill size={18} />
            </a>
            {/* <a target="_blank" rel="noreferrer" href="https://telegram.org">
              <RiInstagramFill />
            </a>
            <a target="_blank" rel="noreferrer" href="https://telegram.org">
              <RiRedditFill />
            </a>
            <a target="_blank" rel="noreferrer" href="https://telegram.org">
              <RiGithubFill />
            </a> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
