const Bot = require('bot-sdk');
const privateKey = require("./rsaKeys.js").privateKey;

let musics = [
    {
        token: 'a0b923820dcc509a',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E5%8F%AA%E9%81%93%E5%AF%BB%E5%B8%B8.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A29Z%2F-1%2F%2F2537b3f87da1d9dc63031b72ad2a9c407cf83db5c1df54fa41512e9c98e4ef1c',
        singer: '谢春花',
        name: '只道是寻常'
    },
    {
        token: '9d4c2f636f067f89',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E6%97%A0%E7%BB%88.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A25Z%2F-1%2F%2Fbbb4d9a98cb86bed22ece4acb41089f057239f53a5ef0cbb1d89926770320e94',
        singer: '谢春花',
        name: '无终'
    },
    {
        token: '4b5ce2fe28308fd9',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E4%B8%80%E6%A3%B5%E4%BC%9A%E5%BC%80%E8%8A%B1%E7%9A%84%E6%A0%91.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A24Z%2F-1%2F%2F5cc19916d29af5f686ac8524ec358c66dd1b60331ab421a7d020440ce0bb395f',
        singer: '谢春花',
        name: '一棵会开花的树'
    },
    {
        token: 'a2f3e71d9181a67b',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E6%88%91%E4%B8%80%E5%AE%9A%E4%BC%9A%E7%88%B1%E4%B8%8A%E4%BD%A0%20%28Demo%29.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A22Z%2F-1%2F%2Fb3baacfa0e0a765809a5b558d78385ee62b92bd7521ab4c1a8aac957ae31d088',
        singer: '谢春花',
        name: '我一定会爱上你'
    },
    {
        token: 'bbce2345d7772b06',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E8%8D%92%E5%B2%9B%20%28Album%20Version%29.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A20Z%2F-1%2F%2F62393592d8d4600255208dbbd3a8bcb99805f15a9ed33e0e929ae61dbd5aa235',
        singer: '谢春花',
        name: '荒岛'
    }
];

const default_image = 'https://skillstore.cdn.bcebos.com/icon/100/c709eed1-c07a-be4a-b242-0b0d8b777041.jpg';

class DuerOSBot extends Bot {
    constructor(postData) {
        super(postData);
        this.curIndex = 0;
        this.waitAnswer();
        this.addLaunchHandler(() => {
            this.waitAnswer();
            this.setExpectSpeech(false);
            return {

                outputSpeech: '欢迎使用分级阅读!',
            };
        });

        this.addSessionEndedHandler(() => {
            this.endSession();
            return {
                outputSpeech: '感谢您的使用'
            };
        });

        this.addIntentHandler('grade_english', () => {
            let monthlySalary = this.getSlot('sys.number');   
            if (!monthlySalary) {  
                this.nlu.ask('sys.number');   
                let card = new Bot.Card.TextCard('你想读几级');  
                return {
                    card: card,
                    outputSpeech: '你想读几级'
                };
            }
            /** 
            let card = new Bot.Card.TextCard('这是意图grade_english的处理函数');
            */
            this.waitAnswer();
            this.setExpectSpeech(false);
            return {
                directives: [this.getDirective(0), this.getTemplate2(musics[this.curIndex])],
                outputSpeech: '正在为你播放'
            };
        });

    }

    /**
     *  更新下一曲的index
     *
     *  @param {string} token 歌曲的id
     */
    updateNextSingIndex(token) {
        let self = this;
        musics.map((music, i) => {
            if (music.token === token) {
                self.curIndex = parseInt(i, 10) + 1 <= musics.length - 1 ? parseInt(i, 10) + 1 : musics.length - 1;
            }
            return null;
        });
    }

    /**
     *  更新上一首的index
     *
     *  @param {string} token 歌曲的id
     */
    updatePreviousSingIndex(token) {
        let self = this;
        musics.map((music, i) => {
            if (music.token === token) {
                self.curIndex = parseInt(i, 10) - 1 >= 0 ? parseInt(i, 10) - 1 : 0;
            }
            return null;
        });
    }

    /**
     *  更新当前正在播放歌曲的index
     *
     *  @param {string} token 歌曲的id
     */
    updateCurrentSingIndex(token) {
        let self = this;
        musics.map(function (music, i) {
            if (music.token === token) {
                self.curIndex = parseInt(i, 10);
            }
            return null;
        });
    }

    /**
     *  获取歌曲播放指令
     *
     *  @param {number} offset 歌曲播放的进度
     *  @return {Bot.Directive.AudioPlayer.Play} Play指令
     */
    getDirective(offset = 0) {
        let directive = new Bot.Directive.AudioPlayer.Play(musics[this.curIndex].url);
        directive.setToken(musics[this.curIndex].token);
        this.setSessionAttribute('token', musics[this.curIndex].token);
        directive.setOffsetInMilliSeconds(offset);
        return directive;
    }

    /**
     *  获取上图下文模版
     *
     *  @param {Object} music 歌曲详情
     *  @return {RenderTemplate} 渲染模版
     */
    getTemplate2(music) {
        let bodyTemplate = new Bot.Directive.Display.Template.BodyTemplate2();
        bodyTemplate.setToken(music.token);
        bodyTemplate.setBackGroundImage(default_image);
        bodyTemplate.setTitle(music.singer);
        bodyTemplate.setPlainContent(music.name);
        let renderTemplate = new Bot.Directive.Display.RenderTemplate(bodyTemplate);
        return renderTemplate;
    }

    /**
     *  获取文本展现模板
     *
     *  @param {string} text 歌曲详情
     *  @return {RenderTemplate} 渲染模版
     */
    getTemplate1(text) {
        let bodyTemplate = new Bot.Directive.Display.Template.BodyTemplate1();
        bodyTemplate.setPlainTextContent(text);
        let renderTemplate = new Bot.Directive.Display.RenderTemplate(bodyTemplate);
        return renderTemplate;
    }

    /**
     *  设置会话属性
     *
     *  @param {Object} event 客户端上报的事件，包含歌曲token和对应播放进度等信息
     */
    setSessionAttr(event) {
        this.setSessionAttribute('token', event.token);
        this.setSessionAttribute('offsetInMilliSeconds', event.offsetInMilliSeconds);
    }


}

exports.handler = function(event, context, callback) {
    try {
        let b = new DuerOSBot(event);
        // 0: debug  1: online
        b.botMonitor.setEnvironmentInfo(privateKey, 0);
        b.run().then(function(result) {
            callback(null, result);
        }).catch(callback);
    } catch (e) {
        callback(e);
    }
}
