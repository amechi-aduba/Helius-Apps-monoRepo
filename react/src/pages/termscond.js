import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/termscond.css";

const TermsCond = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const navigate = useNavigate();

  return (
    <div className="terms-wrapper">
      <div className="terms-main">
        <h2>Terms and Conditions</h2>
        <div className="terms-box">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut
            efficitur neque, in malesuada enim. Ut dignissim urna a tortor
            sodales suscipit. Morbi ullamcorper bibendum mauris ut malesuada.
          </p>
          <p>
            Etiam pellentesque viverra viverra. Nullam ac vestibulum purus.
            Vestibulum urna urna, lacinia id pulvinar at, gravida a risus. Nunc
            tempor feugiat volutpat. Duis hendrerit nunc a lorem pharetra
            lobortis. Etiam sollicitudin fermentum ipsum, ut faucibus urna. Nam
            elementum, dui ac ultrices malesuada, arcu turpis finibus dolor,
            vitae dignissim justo ipsum vitae elit. Vivamus bibendum dolor
            augue, at lacinia sem laoreet sed.
          </p>
          <p>
            Pellentesque eget metus et est convallis feugiat eu a orci. Nulla
            mollis vel ante at eleifend. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas. Donec
            consectetur elementum neque sit amet tempus. Suspendisse purus ex,
            dignissim vitae dolor vitae, luctus maximus mi. Fusce aliquet enim
            eget nibh pellentesque facilisis.
          </p>
          <p>
            Pellentesque neque quam, pretium a bibendum posuere, ornare congue
            turpis. Vivamus laoreet velit in quam tincidunt, ac aliquet felis
            ultrices. Proin ac euismod dui, eget ornare purus. Nunc non pharetra
            magna. Duis vitae velit porttitor odio placerat rhoncus nec ut
            lacus. Fusce mi diam, convallis in lacinia ut, fermentum at sem.
            <p>
              Nam convallis est quis eros efficitur ullamcorper. Aliquam ornare
              metus eu hendrerit laoreet. Sed sapien nisi, laoreet sed euismod
              eu, interdum vitae lacus. Vivamus eu nunc non velit malesuada
              pretium. Praesent porta laoreet tincidunt.
            </p>
            <p>
              Donec in fermentum ante. Mauris id erat at ligula vulputate
              porttitor sit amet in arcu. Donec fermentum enim eros, et
              fringilla ligula mollis at. Duis ut libero id sapien eleifend
              consequat ut sed metus. Proin a nibh nisl. Mauris varius commodo
              lacus rhoncus interdum. Donec finibus laoreet orci, nec faucibus
              mi finibus quis.
            </p>
          </p>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              navigate("/create", { state: { accepted: true } });
            }}
          >
            Accept Terms and Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsCond;
