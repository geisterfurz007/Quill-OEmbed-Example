import { Quill } from 'react-quill'
import { DeltaStatic } from 'quill'

const Delta = Quill.import('delta');
const BlockEmbed = Quill.import('blots/block/embed');

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
        this.quill.insertEmbed(index, 'oembed-wrapper', oEmbed.html, 'api');
        return false
      default:
        return false
    }
  }
}

class OEmbedWrapper extends BlockEmbed {
  static create(value: string) {
    const node = super.create(value);
    
    node.setAttribute('srcdoc', value);

    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    return node;
  }

  static value(node: any) {
    return node.getAttribute('srcdoc');
  }
}

//Name for Quill to find this embed under
OEmbedWrapper.blotName = 'oembed-wrapper';

//Tag to create by Quill
OEmbedWrapper.tagName = 'iframe';

Quill.register(OEmbedWrapper, true);
