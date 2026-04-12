/**
 * server.js
 * 美容皮膚科クリニック HP — Express サーバー
 * Claude API を使った AI チャットボット付き
 */

const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* =============================================
   Claude クライアント初期化
   ANTHROPIC_API_KEY 環境変数を使用
   ============================================= */
const client = new Anthropic();

/* =============================================
   クリニック AI のシステムプロンプト
   ============================================= */
const SYSTEM_PROMPT = `あなたは〇〇美容皮膚科クリニックの専任AIアシスタントです。
患者様のご質問に、温かく丁寧な言葉でお答えください。

【クリニック基本情報】
- 診療科目：美容皮膚科
- 診療時間：月〜金 10:00〜19:00 / 土・日 10:00〜18:00
- 休診日：木曜日・祝日
- 電話：000-0000-0000（予約受付）
- 所在地：〇〇県〇〇市〇〇町0-0-0 〇〇ビル0F

【主な施術メニュー】
1. ヒアルロン酸注射
   - 効果：ほうれい線・涙袋・唇などへのボリューム補充、ハリとふっくら感
   - 持続：部位・種類により6ヶ月〜2年
   - ダウンタイム：内出血・腫れが数日〜1週間程度
   - アフターケア：注射部位を強くマッサージしない、当日は飲酒・激しい運動を控える

2. ボトックス注射
   - 効果：額・眉間・目尻のシワ改善、エラ張り・小顔効果
   - 持続：3〜6ヶ月
   - ダウンタイム：赤み・腫れは数時間〜翌日程度
   - アフターケア：施術後4時間は横にならない（顔面部位）、当日はサウナ・飲酒を控える

3. レーザートーニング
   - 効果：シミ・そばかす・肝斑の色素沈着改善、透明感アップ
   - 目安：5〜10回の複数回施術
   - ダウンタイム：ほぼなし（赤みが数時間続く場合あり）
   - アフターケア：UVケア（日焼け止め必須）、保湿をしっかり行う

4. 美白・点滴療法
   - 効果：高濃度ビタミンCや美白成分を点滴で補給、くすみ改善・美白
   - 目安：1〜2週間に1回のペース
   - ダウンタイム：ほぼなし
   - アフターケア：水分をしっかり摂る、定期的な通院で効果維持

【回答のルール】
- 必ず日本語で回答してください。
- 温かく、プロフェッショナルなトーンを保ってください。
- 具体的な医療アドバイス（薬の処方、病気の診断など）は避け、「診察にてご確認ください」と案内してください。
- 料金は個人差があるため、具体的な金額は避け「カウンセリングにてご案内します」と伝えてください。
- すべての施術は自由診療（保険適用外）であることを伝えてください。
- 回答は親しみやすく、200〜300文字程度を目安にしてください。
- 不明な点は「詳しくはお電話（000-0000-0000）またはご来院時にお尋ねください」と案内してください。`;

/* =============================================
   ミドルウェア
   ============================================= */
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* =============================================
   AI チャット エンドポイント（SSE ストリーミング）
   POST /api/chat
   Body: { messages: [{role, content}, ...] }
   ============================================= */
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  /* 入力バリデーション */
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages が必要です。' });
  }

  /* SSE ヘッダー設定 */
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  try {
    /* Claude API へストリーミングリクエスト */
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    /* テキストデルタをリアルタイムに送信 */
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    /* 完了シグナル送信 */
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Claude API エラー:', error.message);

    /* エラーメッセージを SSE で送信してから終了 */
    res.write(`data: ${JSON.stringify({
      error: '申し訳ございません。一時的にご利用いただけません。しばらくしてから再度お試しください。'
    })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

/* =============================================
   SPA フォールバック（index.html を返す）
   ============================================= */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* =============================================
   サーバー起動
   ============================================= */
app.listen(PORT, () => {
  console.log(`✨ 美容皮膚科クリニック HP サーバー起動`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📌 ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? '設定済み ✓' : '未設定 ✗ (.env または環境変数を設定してください)'}`);
});
