const Bot = require('bot-sdk');
const privateKey = require("./rsaKeys.js").privateKey;

let musics = [
    {
        token: 'a0b923820dcc509a',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E5%8F%AA%E9%81%93%E5%AF%BB%E5%B8%B8.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A29Z%2F-1%2F%2F2537b3f87da1d9dc63031b72ad2a9c407cf83db5c1df54fa41512e9c98e4ef1c',
        singer: 'л����',
        name: 'ֻ����Ѱ��'
    },
    {
        token: '9d4c2f636f067f89',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E6%97%A0%E7%BB%88.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A25Z%2F-1%2F%2Fbbb4d9a98cb86bed22ece4acb41089f057239f53a5ef0cbb1d89926770320e94',
        singer: 'л����',
        name: '����'
    },
    {
        token: '4b5ce2fe28308fd9',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E4%B8%80%E6%A3%B5%E4%BC%9A%E5%BC%80%E8%8A%B1%E7%9A%84%E6%A0%91.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A24Z%2F-1%2F%2F5cc19916d29af5f686ac8524ec358c66dd1b60331ab421a7d020440ce0bb395f',
        singer: 'л����',
        name: 'һ�ûῪ������'
    },
    {
        token: 'a2f3e71d9181a67b',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E6%88%91%E4%B8%80%E5%AE%9A%E4%BC%9A%E7%88%B1%E4%B8%8A%E4%BD%A0%20%28Demo%29.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A22Z%2F-1%2F%2Fb3baacfa0e0a765809a5b558d78385ee62b92bd7521ab4c1a8aac957ae31d088',
        singer: 'л����',
        name: '��һ���ᰮ����'
    },
    {
        token: 'bbce2345d7772b06',
        url: 'http://dbp-resource.gz.bcebos.com/7afe67b5-df74-49bb-9938-a7803926c106/%E8%B0%A2%E6%98%A5%E8%8A%B1-%E8%8D%92%E5%B2%9B%20%28Album%20Version%29.mp3?authorization=bce-auth-v1%2Fa4d81bbd930c41e6857b989362415714%2F2018-05-25T08%3A14%3A20Z%2F-1%2F%2F62393592d8d4600255208dbbd3a8bcb99805f15a9ed33e0e929ae61dbd5aa235',
        singer: 'л����',
        name: '�ĵ�'
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

                outputSpeech: '��ӭʹ�÷ּ��Ķ�!',
            };
        });

        this.addSessionEndedHandler(() => {
            this.endSession();
            return {
                outputSpeech: '��л����ʹ��'
            };
        });

        this.addIntentHandler('grade_english', () => {
            let monthlySalary = this.getSlot('sys.number');   
            if (!monthlySalary) {  
                this.nlu.ask('sys.number');   
                let card = new Bot.Card.TextCard('���������');  
                return {
                    card: card,
                    outputSpeech: '���������'
                };
            }
            /** 
            let card = new Bot.Card.TextCard('������ͼgrade_english�Ĵ�����');
            */
            this.waitAnswer();
            this.setExpectSpeech(false);
            return {
                directives: [this.getDirective(0), this.getTemplate2(musics[this.curIndex])],
                outputSpeech: '����Ϊ�㲥��'
            };
        });

    }

    /**
     *  ������һ����index
     *
     *  @param {string} token ������id
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
     *  ������һ�׵�index
     *
     *  @param {string} token ������id
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
     *  ���µ�ǰ���ڲ��Ÿ�����index
     *
     *  @param {string} token ������id
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
     *  ��ȡ��������ָ��
     *
     *  @param {number} offset �������ŵĽ���
     *  @return {Bot.Directive.AudioPlayer.Play} Playָ��
     */
    getDirective(offset = 0) {
        let directive = new Bot.Directive.AudioPlayer.Play(musics[this.curIndex].url);
        directive.setToken(musics[this.curIndex].token);
        this.setSessionAttribute('token', musics[this.curIndex].token);
        directive.setOffsetInMilliSeconds(offset);
        return directive;
    }

    /**
     *  ��ȡ��ͼ����ģ��
     *
     *  @param {Object} music ��������
     *  @return {RenderTemplate} ��Ⱦģ��
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
     *  ��ȡ�ı�չ��ģ��
     *
     *  @param {string} text ��������
     *  @return {RenderTemplate} ��Ⱦģ��
     */
    getTemplate1(text) {
        let bodyTemplate = new Bot.Directive.Display.Template.BodyTemplate1();
        bodyTemplate.setPlainTextContent(text);
        let renderTemplate = new Bot.Directive.Display.RenderTemplate(bodyTemplate);
        return renderTemplate;
    }

    /**
     *  ���ûỰ����
     *
     *  @param {Object} event �ͻ����ϱ����¼�����������token�Ͷ�Ӧ���Ž��ȵ���Ϣ
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
