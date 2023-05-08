import React from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import {
  RiTelegramFill,
  RiDiscordFill,
  RiFacebookCircleFill,
  RiInstagramFill,
  RiRedditFill,
} from "react-icons/ri";
// import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer className="footer-area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 text-center">
              <div className="footer-items">
                <div className="social-icons d-flex justify-content-center my-4">
                  <a
                    className="facebook"
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <RiFacebookCircleFill />
                  </a>
                  <a
                    className="twitter"
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AiFillTwitterCircle />
                  </a>
                  <a
                    className="reddit"
                    href="https://www.reddit.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <RiRedditFill />
                  </a>
                  <a
                    className="instagram"
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <RiInstagramFill />
                  </a>
                </div>
                <div className="copyright-area py-2">
                  &copy;2022 0xLaunch, All Rights Reserved By 0xLaunch
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
