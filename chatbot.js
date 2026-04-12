/**
 * chatbot.js
 * FAQ選択式 + Claude AI フリーテキスト対応チャットボット
 */

/* =============================================
   FAQ データ定義（選択式ショートカット）
   ============================================= */
const FAQ_TREE = {
  root: {
    message: 'こんにちは！〇〇美容皮膚科クリニックのAIアシスタントです😊\nご質問をお気軽にどうぞ。よく聞かれる質問はボタンからもお選びいただけます。',
    choices: [
      { label: '💉 施術の効果について',    next: 'effect'    },
      { label: '🗓 ダウンタイムについて',  next: 'downtime'  },
      { label: '🌿 施術後のケアについて',  next: 'aftercare' },
      { label: '📅 診療時間・予約について', next: 'schedule'  },
      { label: '💴 料金・保険について',    next: 'price'     },
    ],
  },

  effect: {
    message: 'どの施術の効果についてお知りになりたいですか？',
    choices: [
      { label: 'ヒアルロン酸注射',   next: 'effect_ha'    },
      { label: 'ボトックス注射',      next: 'effect_btx'   },
      { label: 'レーザートーニング', next: 'effect_laser'  },
      { label: '美白・点滴療法',      next: 'effect_drip'  },
      { label: '← 最初に戻る',       next: 'root'         },
    ],
  },
  effect_ha: {
    message: 'ヒアルロン酸注射は、ほうれい線・涙袋・唇などにボリュームを与える施術です。\n\n✅ 効果：施術直後から実感できます。持続は部位・種類により6ヶ月〜2年程度。\nカウンセリングで詳しくご説明します。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_ha'  },
      { label: '他の施術を見る',        next: 'effect'  },
      { label: '← 最初に戻る',         next: 'root'    },
    ],
  },
  effect_btx: {
    message: 'ボトックス注射は、筋肉の動きを抑えシワを改善する施術です。\n\n✅ 効果：施術後3〜7日で現れ、3〜6ヶ月持続します。エラ張り・小顔効果にも人気です。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_btx' },
      { label: '他の施術を見る',        next: 'effect'  },
      { label: '← 最初に戻る',         next: 'root'    },
    ],
  },
  effect_laser: {
    message: 'レーザートーニングは、シミ・そばかす・肝斑などを改善するレーザー施術です。\n\n✅ 効果：5〜10回の施術で効果を実感する方が多いです。透明感のあるお肌へ導きます。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_laser' },
      { label: '他の施術を見る',        next: 'effect'    },
      { label: '← 最初に戻る',         next: 'root'      },
    ],
  },
  effect_drip: {
    message: '美白・点滴療法は、高濃度ビタミンCや美白成分を直接点滴で補給する施術です。\n\n✅ 効果：くすみ改善・肌トーンアップを実感される方が多いです。1〜2週間に1回がおすすめです。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_drip' },
      { label: '他の施術を見る',        next: 'effect'   },
      { label: '← 最初に戻る',         next: 'root'     },
    ],
  },

  downtime: {
    message: 'どの施術のダウンタイムについてお知りになりたいですか？',
    choices: [
      { label: 'ヒアルロン酸注射',   next: 'dt_ha'    },
      { label: 'ボトックス注射',      next: 'dt_btx'   },
      { label: 'レーザートーニング', next: 'dt_laser'  },
      { label: '美白・点滴療法',      next: 'dt_drip'  },
      { label: '← 最初に戻る',       next: 'root'     },
    ],
  },
  dt_ha: {
    message: 'ヒアルロン酸注射のダウンタイム：\n💧 内出血・腫れ：数日〜1週間程度\n💧 針跡：翌日にはほぼ目立ちません\n\n大きな行事の1〜2週間前の施術をおすすめします。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_ha'    },
      { label: '他のダウンタイムを見る', next: 'downtime' },
      { label: '← 最初に戻る',          next: 'root'     },
    ],
  },
  dt_btx: {
    message: 'ボトックス注射のダウンタイム：\n💧 赤み・腫れ：数時間〜翌日程度\n💧 内出血：稀に数日続く場合があります\n\n当日はメイク可能です。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_btx'   },
      { label: '他のダウンタイムを見る', next: 'downtime' },
      { label: '← 最初に戻る',          next: 'root'     },
    ],
  },
  dt_laser: {
    message: 'レーザートーニングのダウンタイム：\n💧 赤み・ほてり：施術後数時間で落ち着くことが多いです\n💧 ほぼダウンタイムなしで受けられます\n\n施術当日から洗顔・メイク可能な場合が多いです。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_laser' },
      { label: '他のダウンタイムを見る', next: 'downtime' },
      { label: '← 最初に戻る',          next: 'root'     },
    ],
  },
  dt_drip: {
    message: '美白・点滴療法のダウンタイム：\n💧 ほとんどありません\n💧 針跡が残る場合がありますが、すぐに目立たなくなります\n\nお仕事の合間にも受けていただけます。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_drip'  },
      { label: '他のダウンタイムを見る', next: 'downtime' },
      { label: '← 最初に戻る',          next: 'root'     },
    ],
  },

  aftercare: {
    message: 'どの施術のアフターケアについてお知りになりたいですか？',
    choices: [
      { label: 'ヒアルロン酸注射',   next: 'ac_ha'    },
      { label: 'ボトックス注射',      next: 'ac_btx'   },
      { label: 'レーザートーニング', next: 'ac_laser'  },
      { label: '美白・点滴療法',      next: 'ac_drip'  },
      { label: '← 最初に戻る',       next: 'root'     },
    ],
  },
  ac_ha: {
    message: 'ヒアルロン酸注射後のケア：\n🌿 注射部位を強くマッサージしない\n🌿 当日は飲酒・激しい運動・長時間入浴を控える\n🌿 保湿をしっかり行う',
    choices: [
      { label: '他のケアを見る', next: 'aftercare' },
      { label: '← 最初に戻る',  next: 'root'      },
    ],
  },
  ac_btx: {
    message: 'ボトックス注射後のケア：\n🌿 施術後4時間は横にならない（顔面部位）\n🌿 当日はサウナ・激しい運動・飲酒を控える\n🌿 注射部位を強く押さない',
    choices: [
      { label: '他のケアを見る', next: 'aftercare' },
      { label: '← 最初に戻る',  next: 'root'      },
    ],
  },
  ac_laser: {
    message: 'レーザートーニング後のケア：\n🌿 日焼け止めを必ず使用する（UVケアが最重要）\n🌿 保湿をしっかり行う\n🌿 こすったり刺激を与えない',
    choices: [
      { label: '他のケアを見る', next: 'aftercare' },
      { label: '← 最初に戻る',  next: 'root'      },
    ],
  },
  ac_drip: {
    message: '点滴療法後のケア：\n🌿 特別な制限はほとんどありません\n🌿 水分をしっかり摂るとより効果的です\n🌿 定期的に通院することで効果が持続しやすくなります',
    choices: [
      { label: '他のケアを見る', next: 'aftercare' },
      { label: '← 最初に戻る',  next: 'root'      },
    ],
  },

  schedule: {
    message: '【診療時間】\n月〜金：10:00 〜 19:00\n土・日：10:00 〜 18:00\n休診日：木曜日・祝日\n\n【ご予約方法】\nお電話（000-0000-0000）またはWebフォームよりご予約ください。初診の方も大歓迎です😊',
    choices: [
      { label: '料金について知りたい', next: 'price' },
      { label: '← 最初に戻る',        next: 'root'  },
    ],
  },

  price: {
    message: '当クリニックの施術は、すべて自由診療（保険適用外）となります。\n\n💴 料金は施術内容・量により異なります。\n📋 無料カウンセリングにてお気軽にご相談ください。',
    choices: [
      { label: '診療時間・予約を知りたい', next: 'schedule' },
      { label: '← 最初に戻る',            next: 'root'     },
    ],
  },
};

/* =============================================
   チャットボット クラス
   ============================================= */
class Chatbot {
  constructor() {
    this.wrapper  = document.getElementById('chatbot');
    this.toggle   = document.getElementById('chatbotToggle');
    this.window   = document.getElementById('chatbotWindow');
    this.messages = document.getElementById('chatbotMessages');
    this.choices  = document.getElementById('chatbotChoices');
    this.input    = document.getElementById('chatbotInput');
    this.sendBtn  = document.getElementById('chatbotSend');

    this.isOpen       = false;
    this.isStreaming  = false;
    this.typingDelay  = 600;

    /* Claude API に渡す会話履歴 */
    this.conversationHistory = [];

    this._bindEvents();
  }

  /* =============================================
     イベント設定
     ============================================= */
  _bindEvents() {
    /* チャット開閉 */
    this.toggle.addEventListener('click', () => this.toggleChat());

    /* 送信ボタン */
    this.sendBtn.addEventListener('click', () => this._handleUserInput());

    /* Enter キーで送信 */
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._handleUserInput();
      }
    });

    /* 入力中は送信ボタンをアクティブに */
    this.input.addEventListener('input', () => {
      const hasText = this.input.value.trim().length > 0;
      this.sendBtn.classList.toggle('is-active', hasText);
    });
  }

  /* =============================================
     チャット開閉
     ============================================= */
  toggleChat() {
    this.isOpen = !this.isOpen;
    this.wrapper.classList.toggle('is-open', this.isOpen);
    this.window.setAttribute('aria-hidden', String(!this.isOpen));
    this.toggle.setAttribute('aria-label', this.isOpen ? 'チャットを閉じる' : 'チャットボットを開く');

    if (this.isOpen && this.messages.children.length === 0) {
      setTimeout(() => this._goTo('root'), 300);
    }

    if (this.isOpen) {
      setTimeout(() => this.input.focus(), 350);
    }
  }

  /* =============================================
     FAQ ツリー遷移
     ============================================= */
  _goTo(nodeKey) {
    const node = FAQ_TREE[nodeKey];
    if (!node) return;

    this.choices.innerHTML = '';
    const typing = this._addTyping();

    setTimeout(() => {
      typing.remove();
      this._addBotMessage(node.message);

      node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => {
          /* FAQ 選択をユーザーメッセージとして履歴に追加 */
          this.conversationHistory.push({ role: 'user', content: choice.label });
          this._addUserMessage(choice.label);
          setTimeout(() => this._goTo(choice.next), 400);
        });
        this.choices.appendChild(btn);
      });
    }, this.typingDelay);
  }

  /* =============================================
     ユーザーフリーテキスト入力の処理
     ============================================= */
  _handleUserInput() {
    if (this.isStreaming) return;

    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.sendBtn.classList.remove('is-active');

    /* 選択肢を非表示にしてフリーテキストモードへ */
    this.choices.innerHTML = '';
    this._addUserMessage(text);

    /* 会話履歴に追加 */
    this.conversationHistory.push({ role: 'user', content: text });

    /* Claude API で回答を取得 */
    this._sendToClaudeAPI();
  }

  /* =============================================
     Claude API 呼び出し（SSE ストリーミング）
     ============================================= */
  async _sendToClaudeAPI() {
    this.isStreaming = true;
    this.input.disabled = true;
    this.sendBtn.disabled = true;

    /* タイピングインジケーター表示 */
    const typing = this._addTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: this.conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      /* タイピングを削除してストリーミングバブルを作成 */
      typing.remove();
      const bubble = this._createStreamingBubble();

      /* SSE を読み込み */
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); /* 末尾の未完行を保持 */

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              this._renderBubbleText(bubble, parsed.error);
              fullText = parsed.error;
            } else if (parsed.text) {
              fullText += parsed.text;
              this._renderBubbleText(bubble, fullText);
            }
          } catch {
            /* JSON パース失敗は無視 */
          }
        }
      }

      /* 会話履歴にアシスタント返答を追加 */
      if (fullText) {
        this.conversationHistory.push({ role: 'assistant', content: fullText });
      }

    } catch (error) {
      typing.remove();
      this._addBotMessage('申し訳ございません。一時的にご利用いただけません。しばらくしてから再度お試しください。');
      console.error('チャットボット エラー:', error);
    } finally {
      this.isStreaming = false;
      this.input.disabled = false;
      this.sendBtn.disabled = false;
      this.input.focus();

      /* 返答後に FAQ ショートカットを表示 */
      this._showReturnChoices();
    }
  }

  /* =============================================
     返答後のショートカットボタン
     ============================================= */
  _showReturnChoices() {
    this.choices.innerHTML = '';

    const shortcuts = [
      { label: '他にも質問する',          action: () => { this.choices.innerHTML = ''; this.input.focus(); } },
      { label: '💉 施術について',          action: () => this._goTo('effect')   },
      { label: '📅 診療時間・予約',        action: () => this._goTo('schedule') },
    ];

    shortcuts.forEach(({ label, action }) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        if (label !== '他にも質問する') {
          this.conversationHistory.push({ role: 'user', content: label });
          this._addUserMessage(label);
        }
        action();
      });
      this.choices.appendChild(btn);
    });
  }

  /* =============================================
     UI ヘルパー
     ============================================= */

  /** ボットメッセージバブル追加 */
  _addBotMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--bot';
    this._renderBubbleText(bubble, text);
    this.messages.appendChild(bubble);
    this._scrollToBottom();
    return bubble;
  }

  /** ユーザーメッセージバブル追加 */
  _addUserMessage(text) {
    this.choices.innerHTML = '';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--user';
    bubble.textContent = text;
    this.messages.appendChild(bubble);
    this._scrollToBottom();
    return bubble;
  }

  /** ストリーミング用の空バブルを作成 */
  _createStreamingBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--bot chat-bubble--streaming';
    this.messages.appendChild(bubble);
    this._scrollToBottom();
    return bubble;
  }

  /** バブルにテキストを描画（改行対応） */
  _renderBubbleText(bubble, text) {
    bubble.innerHTML = '';
    text.split('\n').forEach((line, i) => {
      if (i > 0) bubble.appendChild(document.createElement('br'));
      bubble.appendChild(document.createTextNode(line));
    });
    this._scrollToBottom();
  }

  /** タイピングインジケーター追加 */
  _addTyping() {
    const el = document.createElement('div');
    el.className = 'typing-indicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    this.messages.appendChild(el);
    this._scrollToBottom();
    return el;
  }

  /** 最下部へスクロール */
  _scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  }
}

/* =============================================
   ヘッダースクロール処理
   ============================================= */
function initHeader() {
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =============================================
   ハンバーガーメニュー
   ============================================= */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    nav.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });
}

/* =============================================
   スクロールアニメーション
   ============================================= */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* =============================================
   初期化
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initReveal();
  new Chatbot();
});
