import React from "react";

export default function Contact() {
  return (
    <React.Fragment>
      <section className="apply-area contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-7">
              <div className="apply-form card no-hover">
                <div className="intro d-flex justify-content-between align-items-end mb-4">
                  <div className="intro-content">
                    <span className="intro-text">Contact Us</span>
                  </div>
                </div>
                <form id="contact-form">
                  <div className="form-group">
                    <label for="first-name">First name</label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      placeholder="John"
                      required="required"
                    />
                  </div>
                  <div className="form-group">
                    <label for="last-name">Last name</label>
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      placeholder="Deo"
                      required="required"
                    />
                  </div>
                  <div className="form-group">
                    <label for="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="name@yourmail.com"
                      required="required"
                    />
                    <small className="form-text mt-2">
                      Enter your email address
                    </small>
                  </div>
                  <div className="form-group">
                    <label for="description">Message</label>
                    <textarea
                      id="description"
                      name="message"
                      placeholder="Message"
                      cols="30"
                      rows="3"
                      required="required"
                    ></textarea>
                    <small className="form-text mt-2">
                      Briefly describe what you need
                    </small>
                  </div>
                  <button type="submit" className="btn active">
                    Submit Message <i className="icon-login ml-2"></i>
                  </button>
                </form>
                <p className="form-message"></p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="contact-items mt-4 mt-md-0">
                <div className="card no-hover staking-card">
                  <div className="media">
                    <i className="icon text-effect icon-location-pin m-0"></i>
                    <div className="media-body ml-4">
                      <h4 className="m-0">Gameon Inc.</h4>
                      <p className="my-3">
                        2709 Euclid Avenue, Irvine, California
                      </p>
                      <a className="notice" href="#sec">
                        Get Google Map Link
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card no-hover staking-card my-4">
                  <div className="media">
                    <i className="icon text-effect icon-call-out m-0"></i>
                    <div className="media-body ml-4">
                      <h4 className="m-0">Call Us</h4>
                      <span className="d-inline-block mt-3 mb-1">
                        +805-298-8971
                      </span>
                      <span className="d-inline-block">+626-773-0240</span>
                    </div>
                  </div>
                </div>

                <div className="card no-hover staking-card">
                  <div className="media">
                    <i className="icon text-effect icon-envelope-open m-0"></i>
                    <div className="media-body ml-4">
                      <h4 className="m-0">Reach Us</h4>
                      <span className="d-inline-block mt-3 mb-1">
                        info@yourcompany.com
                      </span>
                      <span className="d-inline-block">
                        support@webmail.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
