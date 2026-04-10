/**
 * chatbot.js
 * FAQ型チャットボット — 選択式ツリーフロー
 * 外部ライブラリ不要、純粋なJavaScript
 */

/* =============================================
   FAQ データ定義
   ============================================= */
const FAQ_TREE = {
  /* ---- ルートメニュー ---- */
  root: {
    message: 'こんにちは！〇〇美容皮膚科クリニックのサポートです😊\nお気軽にご質問ください。',
    choices: [
      { label: '💉 施術の効果について',   next: 'effect'      },
      { label: '🗓 ダウンタイムについて', next: 'downtime'    },
      { label: '🌿 施術後のケアについて', next: 'aftercare'   },
      { label: '📅 診療時間・予約について', next: 'schedule'  },
      { label: '💴 料金・保険について',   next: 'price'       },
    ],
  },

  /* ---- 施術の効果 ---- */
  effect: {
    message: 'どの施術の効果についてお知りになりたいですか？',
    choices: [
      { label: 'ヒアルロン酸注射',     next: 'effect_ha'     },
      { label: 'ボトックス注射',        next: 'effect_btx'    },
      { label: 'レーザートーニング',    next: 'effect_laser'  },
      { label: '美白・点滴療法',        next: 'effect_drip'   },
      { label: '← 最初に戻る',         next: 'root'          },
    ],
  },

  effect_ha: {
    message: 'ヒアルロン酸注射は、ほうれい線・涙袋・唇などにボリュームを与える施術です。\n\n✅ 効果の目安：施術直後から実感できます。持続期間は部位や種類により6ヶ月〜2年程度です。\n個人差がありますので、カウンセリングで詳しくご説明します。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_ha'   },
      { label: '他の施術を見る',         next: 'effect'  },
      { label: '← 最初に戻る',          next: 'root'    },
    ],
  },

  effect_btx: {
    message: 'ボトックス注射は、筋肉の動きを一時的に抑えることでシワを改善する施術です。\n\n✅ 効果の目安：施術後3〜7日で効果が現れ、3〜6ヶ月持続します。エラ張り・小顔効果にも人気です。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_btx'  },
      { label: '他の施術を見る',         next: 'effect'  },
      { label: '← 最初に戻る',          next: 'root'    },
    ],
  },

  effect_laser: {
    message: 'レーザートーニングは、シミ・そばかす・肝斑などの色素沈着を改善するレーザー施術です。\n\n✅ 効果の目安：複数回の施術（目安5〜10回）で効果を実感する方が多いです。透明感のあるお肌へ導きます。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_laser' },
      { label: '他の施術を見る',         next: 'effect'   },
      { label: '← 最初に戻る',          next: 'root'     },
    ],
  },

  effect_drip: {
    message: '美白・点滴療法は、高濃度ビタミンCや美白成分を直接点滴で補給する施術です。\n\n✅ 効果の目安：くすみ改善・肌のトーンアップを実感される方が多いです。1〜2週間に1回のペースがおすすめです。',
    choices: [
      { label: 'ダウンタイムも知りたい', next: 'dt_drip'  },
      { label: '他の施術を見る',         next: 'effect'   },
      { label: '← 最初に戻る',          next: 'root'     },
    ],
  },

  /* ---- ダウンタイム ---- */
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
    message: 'ヒアルロン酸注射のダウンタイムについて：\n\n💧 内出血・腫れ：数日〜1週間程度続く場合があります\n💧 針跡：翌日にはほぼ目立ちません\n\n大きな行事の1〜2週間前に施術されることをおすすめします。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_ha'     },
      { label: '他のダウンタイムを見る', next: 'downtime'  },
      { label: '← 最初に戻る',          next: 'root'      },
    ],
  },

  dt_btx: {
    message: 'ボトックス注射のダウンタイムについて：\n\n💧 注射部位の赤み・腫れ：数時間〜翌日程度\n💧 内出血：稀に数日続く場合があります\n\n当日はメイク可能です。激しい運動やサウナは当日控えてください。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_btx'    },
      { label: '他のダウンタイムを見る', next: 'downtime'  },
      { label: '← 最初に戻る',          next: 'root'      },
    ],
  },

  dt_laser: {
    message: 'レーザートーニングのダウンタイムについて：\n\n💧 赤み・ほてり：施術後数時間で落ち着くことが多いです\n💧 ほぼダウンタイムなしで受けられるレーザーです\n\n施術当日から洗顔・メイク可能な場合が多いです。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_laser'  },
      { label: '他のダウンタイムを見る', next: 'downtime'  },
      { label: '← 最初に戻る',          next: 'root'      },
    ],
  },

  dt_drip: {
    message: '美白・点滴療法のダウンタイムについて：\n\n💧 ダウンタイムはほとんどありません\n💧 針跡が残る場合がありますが、すぐに目立たなくなります\n\nお仕事の合間にも受けていただけます。',
    choices: [
      { label: '施術後のケアを知りたい', next: 'ac_drip'   },
      { label: '他のダウンタイムを見る', next: 'downtime'  },
      { label: '← 最初に戻る',          next: 'root'      },
    ],
  },

  /* ---- アフターケア ---- */
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
    message: 'ヒアルロン酸注射後のケア：\n\n🌿 注射部位を強くマッサージしない\n🌿 当日は飲酒・激しい運動・長時間入浴を控える\n🌿 保湿をしっかり行う\n🌿 気になることがあればすぐにご連絡ください',
    choices: [
      { label: '他のケアを見る',  next: 'aftercare' },
      { label: '← 最初に戻る',   next: 'root'      },
    ],
  },

  ac_btx: {
    message: 'ボトックス注射後のケア：\n\n🌿 施術後4時間は横にならない（特に顔面部位）\n🌿 当日はサウナ・激しい運動・飲酒を控える\n🌿 注射部位を強く押さない\n🌿 効果が出るまで3〜7日かかります',
    choices: [
      { label: '他のケアを見る',  next: 'aftercare' },
      { label: '← 最初に戻る',   next: 'root'      },
    ],
  },

  ac_laser: {
    message: 'レーザートーニング後のケア：\n\n🌿 日焼け止めを必ず使用する（UVケアが最重要です）\n🌿 施術後は保湿をしっかり行う\n🌿 こすったり刺激を与えない\n🌿 規則正しい生活・食事で肌の回復を助けましょう',
    choices: [
      { label: '他のケアを見る',  next: 'aftercare' },
      { label: '← 最初に戻る',   next: 'root'      },
    ],
  },

  ac_drip: {
    message: '点滴療法後のケア：\n\n🌿 特別な制限はほとんどありません\n🌿 水分をしっかり摂るとより効果的です\n🌿 定期的に通院することで効果が持続しやすくなります',
    choices: [
      { label: '他のケアを見る',  next: 'aftercare' },
      { label: '← 最初に戻る',   next: 'root'      },
    ],
  },

  /* ---- 診療時間・予約 ---- */
  schedule: {
    message: '【診療時間】\n月〜金：10:00 〜 19:00\n土・日：10:00 〜 18:00\n休診日：木曜日・祝日\n\n【ご予約方法】\nお電話（000-0000-0000）またはWebフォームよりご予約ください。初診の方も大歓迎です😊',
    choices: [
      { label: '料金について知りたい', next: 'price' },
      { label: '← 最初に戻る',        next: 'root'  },
    ],
  },

  /* ---- 料金・保険 ---- */
  price: {
    message: '当クリニックの施術は、すべて自由診療（保険適用外）となります。\n\n💴 料金は施術内容・量により異なります。\n📋 カウンセリング（無料）にてお気軽にご相談ください。\n\n※ 詳細な料金はカウンセリング時にお伝えします。',
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
    /* DOM要素取得 */
    this.wrapper   = document.getElementById('chatbot');
    this.toggle    = document.getElementById('chatbotToggle');
    this.window    = document.getElementById('chatbotWindow');
    this.messages  = document.getElementById('chatbotMessages');
    this.choices   = document.getElementById('chatbotChoices');

    this.isOpen    = false;
    this.typingDelay = 700; /* ボットの返答遅延（ms） */

    this._bindEvents();
  }

  /* イベント設定 */
  _bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleChat());
  }

  /* チャット開閉 */
  toggleChat() {
    this.isOpen = !this.isOpen;
    this.wrapper.classList.toggle('is-open', this.isOpen);
    this.window.setAttribute('aria-hidden', String(!this.isOpen));
    this.toggle.setAttribute('aria-label', this.isOpen ? 'チャットを閉じる' : 'チャットボットを開く');

    /* 初回オープン時にルートを表示 */
    if (this.isOpen && this.messages.children.length === 0) {
      setTimeout(() => this._goTo('root'), 300);
    }
  }

  /* 指定ノードへ遷移 */
  _goTo(nodeKey) {
    const node = FAQ_TREE[nodeKey];
    if (!node) return;

    /* 選択肢をクリア */
    this.choices.innerHTML = '';

    /* タイピングインジケーター表示 */
    const typing = this._addTyping();

    setTimeout(() => {
      /* タイピング削除 → メッセージ表示 */
      typing.remove();
      this._addBotMessage(node.message);

      /* 選択肢ボタン描画 */
      node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => {
          this._addUserMessage(choice.label);
          setTimeout(() => this._goTo(choice.next), 400);
        });
        this.choices.appendChild(btn);
      });
    }, this.typingDelay);
  }

  /* ボットメッセージ追加 */
  _addBotMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--bot';
    /* 改行コードをbrタグに変換（XSSを防ぐため textContent で処理） */
    text.split('\n').forEach((line, i) => {
      if (i > 0) bubble.appendChild(document.createElement('br'));
      bubble.appendChild(document.createTextNode(line));
    });
    this.messages.appendChild(bubble);
    this._scrollToBottom();
  }

  /* ユーザーメッセージ追加 */
  _addUserMessage(text) {
    /* 選択肢をクリア */
    this.choices.innerHTML = '';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--user';
    bubble.textContent = text;
    this.messages.appendChild(bubble);
    this._scrollToBottom();
  }

  /* タイピングインジケーター追加 */
  _addTyping() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    this.messages.appendChild(indicator);
    this._scrollToBottom();
    return indicator;
  }

  /* 最下部へスクロール */
  _scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  }
}

/* =============================================
   ヘッダースクロール処理
   ============================================= */
function initHeader() {
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
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

  /* ナビリンククリック時にメニューを閉じる */
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });
}

/* =============================================
   スクロールアニメーション（Intersection Observer）
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
