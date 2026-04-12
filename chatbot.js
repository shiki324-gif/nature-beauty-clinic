/**
 * chatbot.js
 * FAQ選択式 + Claude AI フリーテキスト対応チャットボット
 */

/* =============================================
   FAQ データ定義（選択式ショートカット）
   ※ dify_quick_reply_master.csv をベースに構成
   ============================================= */
const FAQ_TREE = {

  /* ── スタート ── */
  root: {
    message: 'こんにちは！美容皮膚科クリニックのAIアシスタントです😊\nご質問をお気軽にどうぞ。よく聞かれる質問はボタンからもお選びいただけます。',
    choices: [
      { label: '💉 施術について知りたい',     next: 'treatment'   },
      { label: '💴 料金について知りたい',     next: 'price'       },
      { label: '😟 痛み・ダウンタイムが不安', next: 'pain'        },
      { label: '📅 予約・来院について',       next: 'reservation' },
    ],
  },

  /* ── 施術について ── */
  treatment: {
    message: '施術について、何を知りたいですか？',
    choices: [
      { label: 'どんな施術が合うか知りたい',   next: 'treatment_match'    },
      { label: '施術時間や回数を知りたい',     next: 'treatment_duration' },
      { label: '痛みやダウンタイムを知りたい', next: 'pain'               },
      { label: 'まだ決まっていない',           next: 'treatment_undecided'},
      { label: '← 最初に戻る',               next: 'root'               },
    ],
  },
  treatment_match: {
    message: 'お悩みやご希望によって適した施術は異なります。\nシミ・ニキビ・毛穴・くすみ・肌質改善など、さまざまなお悩みに対応できる施術をご用意しています。\n\n当院では無理に施術をおすすめすることはありません。お気軽にカウンセリングでご相談ください😊',
    choices: [
      { label: '施術時間や回数も知りたい', next: 'treatment_duration' },
      { label: '予約・来院について',       next: 'reservation'        },
      { label: '← 最初に戻る',           next: 'root'               },
    ],
  },
  treatment_duration: {
    message: '【施術時間】\nカウンセリングを含めて30分〜1時間程度が目安です。初診時は説明の時間を多めに確保しています。\n\n【通院回数】\n目的やお悩みの程度によって異なります。複数回を前提とするケースが多いですが、無理のないペースでご案内します。\n\n詳しくはカウンセリングでご案内します。',
    choices: [
      { label: '料金について知りたい', next: 'price'       },
      { label: '予約を検討する',       next: 'reservation' },
      { label: '← 最初に戻る',       next: 'root'        },
    ],
  },
  treatment_undecided: {
    message: '施術がまだ決まっていない方も大歓迎です😊\nまずはお悩みをお聞きし、一般的な選択肢をご案内します。肌状態によって適した施術は異なるため、医師によるカウンセリングで丁寧にご説明します。\n\n無理に施術をおすすめすることはありませんのでご安心ください。',
    choices: [
      { label: '予約・来院について', next: 'reservation' },
      { label: '施術内容を詳しく',   next: 'treatment'   },
      { label: '← 最初に戻る',     next: 'root'        },
    ],
  },

  /* ── 料金について ── */
  price: {
    message: '料金について、何を知りたいですか？',
    choices: [
      { label: '施術の料金を知りたい',            next: 'price_basic'    },
      { label: '初診料・カウンセリング料について', next: 'price_first'    },
      { label: 'キャンペーン・初回割引について',  next: 'price_campaign' },
      { label: '支払い方法について',              next: 'price_payment'  },
      { label: '← 最初に戻る',                  next: 'root'           },
    ],
  },
  price_basic: {
    message: '料金は施術内容によって異なります。通常料金・初回料金・セット料金などをご用意しています。\n\n✅ 美容目的の施術はすべて自由診療（保険適用外）です。\n\n具体的な金額はカウンセリングでご案内します。追加費用が発生する場合（麻酔代等）は事前にご説明します。',
    choices: [
      { label: 'キャンペーンについて', next: 'price_campaign' },
      { label: '支払い方法を知りたい', next: 'price_payment'  },
      { label: '← 最初に戻る',       next: 'root'           },
    ],
  },
  price_first: {
    message: '初診料・カウンセリング料は、無料の場合と有料の場合があります。\n費用が発生する場合は事前にご案内しておりますのでご安心ください。\n\n期間限定の割引により無料となる場合もあります。詳細はお問い合わせください。',
    choices: [
      { label: 'キャンペーンについて', next: 'price_campaign' },
      { label: '予約を検討する',       next: 'reservation'   },
      { label: '← 最初に戻る',       next: 'root'           },
    ],
  },
  price_campaign: {
    message: '期間限定キャンペーンや初回割引を実施する場合があります。\n最新情報は公式サイトや受付でご確認いただけます。\n\n無理に勧めることはありませんのでご安心ください😊',
    choices: [
      { label: '料金全般を知りたい', next: 'price_basic'  },
      { label: '予約を検討する',     next: 'reservation'  },
      { label: '← 最初に戻る',     next: 'root'         },
    ],
  },
  price_payment: {
    message: '💳 現金・クレジットカード・電子マネー・QR決済など、複数の支払い方法をご利用いただけます。\n\n施術内容によっては分割払いや医療ローンを利用できる場合もあります（審査あり）。\n無理なご案内はいたしませんのでご安心ください。',
    choices: [
      { label: '料金について詳しく', next: 'price_basic' },
      { label: '予約を検討する',     next: 'reservation' },
      { label: '← 最初に戻る',     next: 'root'        },
    ],
  },

  /* ── 痛み・ダウンタイム ── */
  pain: {
    message: '痛み・ダウンタイムについて、何が気になりますか？',
    choices: [
      { label: '痛みはどれくらいありますか？', next: 'pain_level'  },
      { label: 'ダウンタイムはありますか？',   next: 'downtime'    },
      { label: '仕事や生活への影響が心配',     next: 'pain_daily'  },
      { label: '施術後の注意点を知りたい',     next: 'aftercare'   },
      { label: '← 最初に戻る',               next: 'root'        },
    ],
  },
  pain_level: {
    message: '痛みの感じ方には個人差がありますが、一般的には軽い刺激やチクチク感を感じる程度とされています。\n\n必要に応じて麻酔を使用する場合もあります。痛みが心配な方もお気軽にお伝えください。無理に我慢していただくことはありません😊',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'downtime'    },
      { label: '予約を検討する',         next: 'reservation' },
      { label: '← 最初に戻る',         next: 'root'        },
    ],
  },
  downtime: {
    message: 'ダウンタイムは施術内容によって異なります。\n\n💧 一般的には赤みやヒリつきが一時的に出る場合があります\n💧 多くは数時間〜数日で落ち着くケースが一般的です\n💧 生活への影響には個人差があります\n\n詳しくは医師によるカウンセリングでご案内します。',
    choices: [
      { label: '仕事への影響が心配',     next: 'pain_daily'  },
      { label: '施術後の注意点を知りたい', next: 'aftercare'  },
      { label: '← 最初に戻る',          next: 'root'        },
    ],
  },
  pain_daily: {
    message: '施術によっては当日から通常の日常生活が可能な場合もありますが、内容によって注意点が異なります。\n\n大切な予定（撮影・イベント等）がある場合は事前にご相談ください。生活スタイルに合わせてご案内します。',
    choices: [
      { label: '施術後の注意点を知りたい', next: 'aftercare'   },
      { label: '予約を検討する',           next: 'reservation' },
      { label: '← 最初に戻る',           next: 'root'        },
    ],
  },
  aftercare: {
    message: '【施術後のポイント】\n🌿 紫外線対策（日焼け止め）は必須です\n🌿 保湿をしっかり行ってください\n🌿 当日は飲酒・激しい運動・長時間入浴を控える\n🌿 刺激の強いスキンケア成分は一時的に控える\n🌿 気になる症状があれば早めにご連絡ください\n\n詳細は施術当日にスタッフが丁寧にご説明します。',
    choices: [
      { label: '予約を検討する', next: 'reservation' },
      { label: '← 最初に戻る', next: 'root'        },
    ],
  },

  /* ── 予約・来院 ── */
  reservation: {
    message: '予約・来院について、何を知りたいですか？',
    choices: [
      { label: '予約方法を知りたい',       next: 'reservation_how'   },
      { label: '当日の予約はできますか？', next: 'reservation_today' },
      { label: '来院時の流れを知りたい',   next: 'visit_flow'        },
      { label: '持ち物・メイクについて',   next: 'visit_items'       },
      { label: '← 最初に戻る',           next: 'root'              },
    ],
  },
  reservation_how: {
    message: '📱 予約は公式サイトの予約ページから24時間いつでもお手続きいただけます。スマートフォンからも簡単にご予約いただけます。\n\nキャンセル・変更も予約ページまたはお問い合わせ窓口から手続き可能です。できるだけ早めにご連絡ください。',
    choices: [
      { label: '当日予約はできますか？', next: 'reservation_today' },
      { label: '来院時の流れを知りたい', next: 'visit_flow'        },
      { label: '← 最初に戻る',         next: 'root'              },
    ],
  },
  reservation_today: {
    message: '当日のご予約は空き状況によって可能な場合があります。公式サイトの予約ページから最新の空き枠をご確認いただくか、直接お問い合わせください。\n\n当院は原則予約制のため、事前のご予約をおすすめします。',
    choices: [
      { label: '来院時の流れを知りたい', next: 'visit_flow'   },
      { label: '← 最初に戻る',         next: 'root'         },
    ],
  },
  visit_flow: {
    message: '【初診の流れ】\n① 受付・カウンセリングシート記入\n② カウンセラーがお悩みをヒアリング\n③ 医師が肌状態を確認\n④ 施術内容・注意点のご説明\n⑤ ご納得いただけた場合に施術へ\n\n✅ 無理に当日施術を行うことはありません\n✅ 所要時間は1〜1.5時間程度が目安です',
    choices: [
      { label: '持ち物・メイクについて', next: 'visit_items'       },
      { label: '予約方法を知りたい',     next: 'reservation_how'   },
      { label: '← 最初に戻る',         next: 'root'              },
    ],
  },
  visit_items: {
    message: '【お持ち物】\n📄 身分証明書（免許証・保険証など）\n💳 クレジットカード（ご利用の場合）\n👓 コンタクトレンズ使用の方はケース\n\n【メイクについて】\nメイクをしたままご来院いただいて問題ありません。施術前に必要な場合は院内でメイクオフをご案内します。',
    choices: [
      { label: '来院時の流れを知りたい', next: 'visit_flow'      },
      { label: '予約方法を知りたい',     next: 'reservation_how' },
      { label: '← 最初に戻る',         next: 'root'            },
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
     返答後のショートカットボタン（補助ボタン）
     ※ dify_quick_reply_master.csv「補助」ステージに対応
     ============================================= */
  _showReturnChoices() {
    this.choices.innerHTML = '';

    const shortcuts = [
      {
        label: 'ほかの質問もしたい',
        action: () => { this.choices.innerHTML = ''; this.input.focus(); },
        isText: true,
      },
      {
        label: 'カウンセリングについて知りたい',
        action: () => this._goTo('visit_flow'),
      },
      {
        label: '💉 施術について',
        action: () => this._goTo('treatment'),
      },
      {
        label: '📅 予約・来院について',
        action: () => this._goTo('reservation'),
      },
    ];

    shortcuts.forEach(({ label, action, isText }) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        /* 「ほかの質問もしたい」はユーザーメッセージとして表示しない */
        if (!isText) {
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
