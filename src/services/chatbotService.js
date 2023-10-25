import request from "request";
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = "https://bit.ly/long-bot1";

let callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v18.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};
let getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          body = JSON.parse(body);
          let username = `${body.last_name} ${body.first_name}`;
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUserName(sender_psid);
      let response1 = {
        text: `Xin chào mừng bạn ${username} đến với nhà hàng của chúng tôi .`,
      };
      let response2 = getStartedTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);

      // send generic template message
      await callSendAPI(sender_psid, response2);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getStartedTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Nhà hàng Only-One kính chào quý khách",
            subtitle: "Dưới đây là các lựa chọn của nhà hàng",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "MENU CHÍNH",
                payload: "MAIN_MENU",
              },
              {
                type: "postback",
                title: "ĐẶT BÀN",
                payload: "RESERVE_TABLE",
              },
              {
                type: "postback",
                title: "HƯỚNG DẪN SỬ DỤNG BOT",
                payload: "GUIDE_TO_USE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getMainMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Menu của nhà hàng",
            subtitle:
              "Chúng tôi hân hạnh mang đến cho bạn thực đơn phong phú cho các bữa ăn trong ngày .",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Bữa sáng",
                payload: "BREAK_FIRST_MENU",
              },
              {
                type: "postback",
                title: "Bữa trưa",
                payload: "LUNCH_MENU",
              },
              {
                type: "postback",
                title: "Bữa tối",
                payload: "DINNER_MENU",
              },
            ],
          },

          {
            title: "Giờ mở cửa :",
            subtitle: "T2-T6 5AM - 10PM | T7 & CN 6AM - 9PM",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "ĐẶT BÀN",
                payload: "RESERVE_TABLE",
              },
            ],
          },

          {
            title: "Không gian nhà hàng",
            subtitle:
              "Nhà hàng có sức chứa lên đến 300 khách ngồi và các bữa tiệc lớn .",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "CHI TIẾT CỦA PHÒNG",
                payload: "SHOW_ROOMS",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
module.exports = {
  handleGetStarted,
  handleSendMainMenu,
};