import { extractCritical } from "emotion-server";
import Document, {
  DocumentContext,
  Head,
  Main,
  NextScript
} from "next/document";

class MyDocument extends Document<{ ids: string[]; css: string }> {
  render() {
    return (
      <html>
        <Head>
          <style
            data-emotion-css={this.props.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const { renderPage } = ctx;

  const page = await renderPage();

  const styles = extractCritical(page.html);

  return { ...page, ...styles };
};

export default MyDocument;
