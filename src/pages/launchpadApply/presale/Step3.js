import React, { useContext, useState } from "react";
import Context from "./context/Context";
import { toast } from "react-toastify";

export default function Step3() {
  const { value, btnNextStep, btnPrevStep, setValue } = useContext(Context);
  const [error, setError] = useState({
    logourl: "",
    bannerurl: "",
    website: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    youtube: "",
    brief: "",
    blockstart: "",
  });

  const checkValidation = (input, inputValue) => {
    let terror = 0;
    let message = "";
    var reg;
    switch (input) {
      case "facebook":
      case "twitter":
      case "github":
      case "telegram":
      case "instagram":
      case "discord":
      case "reddit":
      case "youtube":
      case "blockstart":
        reg = new RegExp(
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
        );
        if (inputValue !== "" && !reg.test(inputValue)) {
          terror += 1;
          message = "Please Enter Valid url!";
        } else {
          message = "";
        }
        break;

      case "logourl":
      case "bannerurl":
      case "website":
        reg = new RegExp(
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
        );
        if (!reg.test(inputValue)) {
          terror += 1;
          message = "Please Enter Valid url!";
        } else {
          message = "";
        }
        break;
      default:
        terror += 0;
        break;
    }

    if (terror > 0) {
      setError({ ...error, [input]: message });
      return false;
    } else {
      setError({ ...error, [input]: "" });
      return true;
    }
  };

  const checkAllValidation = () => {
    let terror = 0;
    var reg;
    Object.keys(value).map((key, index) => {
      switch (key) {
        case "facebook":
        case "twitter":
        case "github":
        case "telegram":
        case "instagram":
        case "discord":
        case "reddit":
        case "youtube":
        case "blockstart":
          reg = new RegExp(
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
          );
          if (value[key] !== "" && !reg.test(value[key])) {
            terror += 1;
          }

          break;

        case "logourl":
        case "bannerurl":
        case "website":
          reg = new RegExp(
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
          );
          if (!reg.test(value[key])) {
            terror += 1;
          }

          break;
        default:
          terror += 0;
          break;
      }
      return true;
    });

    if (terror > 0) {
      return false;
    } else {
      return true;
    }
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    checkValidation(e.target.name, e.target.value);
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const btnNextStepValidation = () => {
    let check = checkAllValidation();
    if (check) {
      btnNextStep();
    } else {
      toast.error("Required all field ! please check again");
    }
  };

  return (
    <div
      className={`tab-pane ${value.step === 3 ? "active" : ""}`}
      role="tabpanel"
      id="step3"
    >
      <h4 className="text-center">Let people know who you are</h4>
      <div className="row">
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Logo URL<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="logourl"
              placeholder="e.g. https://i.ibb.co/pvyN7PB/testimage.png"
            />
            <small className="text-danger">{error.logourl}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Banner Image URL<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="bannerurl"
              placeholder="e.g. https://i.ibb.co/QjW6pvx/banner.png"
            />
            <small className="text-danger">{error.bannerurl}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>
              Website*<span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="website"
              placeholder="e.g. https://picsum.photos"
            />
            <small className="text-danger">{error.website}</small>
            <br />
          </div>
        </div>

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Facebook</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="facebook"
              placeholder="e.g. https://www.facebook.com/"
            />
            <small className="text-danger">{error.facebook}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Twitter</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="twitter"
              placeholder="e.g. https://twitter.com/"
            />
            <small className="text-danger">{error.twitter}</small>
            <br />
          </div>
        </div>

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Github</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="github"
              placeholder="e.g. https://github.com/"
            />
            <small className="text-danger">{error.github}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Telegram</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="telegram"
              placeholder="e.g. https://t.me/BlockStar_Social_Media"
            />
            <small className="text-danger">{error.telegram}</small>
            <br />
          </div>
        </div>

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Instagram</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="instagram"
              placeholder="e.g. https://www.instagram.com/"
            />
            <small className="text-danger">{error.instagram}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Discord</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="discord"
              placeholder="e.g. https://discord.com/"
            />
            <small className="text-danger">{error.discord}</small>
            <br />
          </div>
        </div>

        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Reddit</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="reddit"
              placeholder="e.g. https://reddit.com/"
            />
            <small className="text-danger">{error.reddit}</small>
            <br />
          </div>
        </div>
        <div className="col-md-6 mt-4 mb-0">
          <div className="form-group">
            <label>Youtube Video</label>
            <input
              className="form-control"
              onChange={(e) => onChangeInput(e)}
              type="text"
              name="youtube"
              placeholder="e.g. https://youtube.com/watch"
            />
            <small className="text-danger">{error.youtube}</small>
            <br />
          </div>
        </div>

        <div className="col-md-12 mt-4 mb-0">
          <div className="form-group">
            <label>Description</label>
            <textarea
              type="text"
              name="brief"
              onChange={(e) => onChangeInput(e)}
              className="brief"
              placeholder="Project Brief"
              value={value.brief}
            ></textarea>
            <small className="text-danger">{error.brief}</small>
            <br />
          </div>
        </div>
      </div>
      <ul className="list-inline text-center">
        <li>
          <button
            type="button"
            className="btn default-btn prev-step mr-4"
            onClick={(e) => btnPrevStep(e)}
          >
            Back
          </button>
        </li>
        <li>
          <button
            type="button"
            className="btn default-btn next-step"
            onClick={(e) => btnNextStepValidation(e)}
          >
            Continue
          </button>
        </li>
      </ul>
    </div>
  );
}
