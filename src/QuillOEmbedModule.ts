import { Quill } from 'react-quill'
import { Delta, DeltaStatic } from 'quill'

export default class QuillOEmbedModule {
  private quill: Quill

  constructor(quill: Quill) {
    this.quill = quill
    quill.clipboard.addMatcher(Node.TEXT_NODE, this.pasteHandler.bind(this))
  }

  private pasteHandler(node: any, delta: DeltaStatic): DeltaStatic {
    if (delta.ops && QuillOEmbedModule.isValidUrl(node.data) && node.data.toLowerCase().indexOf('oembed') > -1) {
      const index = this.quill.getLength() - node.data.length
      const formatParam = '&format=json'

      fetch(node.data + formatParam, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => this.insertEmbedFromJson(json, index))
        .then(removeOriginal => {
          if (removeOriginal) this.quill.updateContents(new Delta().delete(node.data.length))
        })
    }

    return delta
  }

  private static isValidUrl(potentialUrl: string): boolean {
    try {
      new URL(potentialUrl)
      return true
    } catch (e) {
      return false
    }
  }

  private insertEmbedFromJson(oEmbed: any, index: number): boolean {
    switch (oEmbed.type) {
      case 'photo':
        this.quill.insertEmbed(index, 'image', oEmbed.url, 'api')
        return true
      case 'video':
      case 'rich':
        this.quill.clipboard.dangerouslyPasteHTML(oEmbed.html, 'api')
        return true
      default:
        return false
    }
  }
}
