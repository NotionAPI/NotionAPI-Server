import BlockContent from './block-content/BlockContent';
import BlockType from './BlockType';

interface Block {
  type: BlockType;
  content: BlockContent;
}

export default Block;
