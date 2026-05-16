import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const WORD_LIST = [
  'abandon','ability','able','about','above','absent','absorb','abstract','absurd','abuse','access','accident',
  'account','accuse','achieve','acid','acoustic','acquire','across','act','action','actor','actress','actual',
  'adapt','add','addict','address','adjust','admit','adult','advance','advice','aerobic','affair','afford',
  'afraid','again','age','agent','agree','ahead','aim','air','airport','aisle','alarm','album','alcohol',
  'alert','alien','all','alley','allow','almost','alone','alpha','already','also','alter','always','amateur',
  'amazing','among','amount','amused','anchor','ancient','anger','angle','angry','animal','ankle','announce',
  'annual','another','answer','antenna','antique','anxiety','any','apart','apology','appear','apple','approve',
  'april','arch','arctic','area','arena','argue','arm','armed','armor','army','around','arrange','arrest',
  'arrive','arrow','art','artefact','artist','artwork','ask','aspect','assault','asset','assist','assume',
  'asthma','athlete','atom','attack','attend','attitude','attract','auction','audit','august','aunt','author',
  'auto','autumn','average','avocado','avoid','awake','aware','away','awesome','awful','awkward','axis',
  'baby','back','bacon','badge','bag','balance','balcony','ball','bamboo','banana','bar','barely',
  'bargain','barrel','base','basic','basket','battle','beach','bean','bear','beat','beauty','become',
  'beef','before','begin','behave','behind','believe','bell','belong','below','belt','bench','benefit',
  'best','betray','better','between','beyond','bicycle','bid','bike','bind','biology','bird','birth',
  'bitter','black','blade','blame','blanket','blast','bless','blind','blood','bloom','blue','blur',
  'blush','board','boat','body','boil','bomb','bone','bonus','book','boost','boot','border',
  'boring','borrow','boss','bottle','bottom','bounce','box','boy','brain','brake','branch','brass',
  'brave','bread','break','breast','breeze','brick','bridge','brief','bright','bring','brisk','broad',
  'broccoli','bronze','broom','brother','brown','brush','bubble','buddy','budget','buffalo','build','bulb',
  'bulk','bullet','bundle','bunny','burden','burger','burn','burst','bus','bush','business','busy',
  'butter','buzz','cabbage','cabin','cable','cactus','cage','cake','calm','camel','camp','canal',
  'cancel','candy','cannon','canoe','canvas','canyon','capable','capital','captain','car','carbon','card',
  'cargo','carpet','carrot','carry','cart','carve','case','cash','castle','cat','catch','category',
  'cattle','caught','cause','caution','cave','ceiling','celery','cell','cello','cement','census','center',
  'century','cereal','certain','chair','chalk','challenge','champion','chance','change','channel','chaos','chapter',
  'charge','charm','chart','chase','chat','cheap','check','cheek','cheer','chef','chess','chest',
  'chicken','chief','child','chili','chimney','chin','chip','chive','chocolate','choice','choir','choose',
  'chop','chord','chore','chose','chronic','chuckle','chunk','church','cider','cinema','circle','circus',
  'citizen','city','civil','claim','clap','clarify','clash','class','claw','clay','clean','clear',
  'clerk','clever','click','client','cliff','climate','climb','clinic','clip','clock','close','cloth',
  'cloud','clown','club','clue','clump','coach','coal','coast','coat','cobra','coconut','code',
  'coffee','coil','coin','coke','cold','collar','collect','college','colony','color','column','comb',
  'combine','come','comic','comma','common','company','compare','compass','compete','compile','complex','compose',
  'concept','concern','concert','condor','conduct','confirm','connect','consent','consider','consist','contact','contain',
  'content','contest','context','control','convert','convince','cook','cool','copy','coral','cord','core',
  'cork','corn','correct','cost','cotton','couch','cough','could','count','country','county','couple',
  'courage','course','court','cousin','cover','covet','cow','cozy','crab','crack','cradle','craft',
  'crane','crank','crash','crate','crave','crawl','crazy','cream','create','credit','creek','crew',
  'cricket','crime','crisp','critic','crop','cross','crow','crowd','crown','crucial','cruel','cruise',
  'crumb','crush','crust','crystal','cube','cubicle','cucumber','cue','cuff','cult','cup','cure',
  'curl','curry','curve','custom','cute','cycle','cynic','dad','dagger','daily','dairy','daisy',
  'damage','dance','danger','daring','dark','dart','dash','data','date','daughter','dawn','day',
  'dazzle','dead','deaf','deal','dear','death','debate','debit','debt','decade','decay','decent',
  'decide','decline','decorate','decrease','decree','dedicate','deem','deep','deer','default','defeat','defend',
  'define','defy','degree','delay','delete','delight','deliver','delta','demand','demo','democracy','demon',
  'denial','dense','dent','deny','depart','depend','depict','deposit','depth','deputy','derive','describe',
  'desert','design','desk','despair','destroy','detach','detail','detect','develop','device','devote','devour',
  'diabetes','diary','dice','dictate','die','diet','differ','digit','dilemma','dine','dinner','dinosaur',
  'diploma','direct','dirt','disagree','disc','disco','discount','discover','discuss','disease','dish','dismiss',
  'display','distance','ditch','dive','divide','divine','dizzy','doctor','document','dog','doll','dollar',
  'dolphin','domain','donate','donkey','donor','doom','door','dose','dot','double','doubt','dough',
  'dove','down','doze','dozen','draft','drag','dragon','drain','drama','drastic','draw','dream',
  'dress','drift','drill','drink','drip','drive','drop','drought','drown','drum','dry','duck',
  'dumb','dump','during','dusk','dust','duty','dwarf','dwell','dye','dynamic','eager','eagle',
  'ear','early','earn','earth','ease','east','easy','eat','echo','eclipse','economy','edge',
  'edit','educate','eel','effect','effort','egg','eight','either','elbow','elder','elect','elegant',
  'element','elephant','elite','else','email','embark','embed','embody','embrace','emerge','emotion','emperor',
  'emphasis','empire','employ','empty','enable','enact','end','endure','enemy','energy','enforce','engage',
  'engine','enjoy','enlist','enough','enrich','enroll','ensure','enter','entire','entry','envelope','envy',
  'epic','episode','equal','equip','era','erase','erect','erode','error','erupt','escape','essay',
  'essence','estate','eternal','ethic','evacuate','evade','evaluate','even','evening','event','ever','every',
  'evidence','evil','evoke','exact','exam','example','exceed','excel','except','excess','exchange','excite',
  'exclude','excuse','execute','exercise','exhaust','exhibit','exile','exist','exit','exotic','expand','expect',
  'expense','expert','explain','explode','explore','export','expose','express','extend','extra','eye','eyebrow'
];

function generateMnemonic(): string {
  const result: string[] = [];
  for (let i = 0; i < 20; i++) {
    result.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  }
  return result.join(' ');
}

function generateKeyPair(_mnemonic: string): string {
  let hash = 0;
  for (let i = 0; i < _mnemonic.length; i++) {
    const char = _mnemonic.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const chars = '0123456789abcdef';
  let key = '';
  for (let i = 0; i < 64; i++) {
    key += chars[Math.abs((hash + i * 31 + i * i * 7) % 16)];
  }
  return key;
}

interface IdentityState {
  mnemonic: string | null;
  publicKey: string | null;
  displayName: string;
  isOnboarded: boolean;
  generateIdentity: () => string;
  recoverIdentity: (mnemonic: string) => boolean;
  setDisplayName: (name: string) => void;
  resetIdentity: () => void;
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      mnemonic: null,
      publicKey: null,
      displayName: 'Phantm User',
      isOnboarded: false,

      generateIdentity: () => {
        const mnemonic = generateMnemonic();
        const publicKey = generateKeyPair(mnemonic);
        set({ mnemonic, publicKey });
        return mnemonic;
      },

      recoverIdentity: (mnemonic: string) => {
        const words = mnemonic.trim().toLowerCase().split(/\s+/);
        if (words.length !== 20) return false;
        const publicKey = generateKeyPair(mnemonic);
        set({ mnemonic, publicKey, isOnboarded: true });
        return true;
      },

      setDisplayName: (name: string) => set({ displayName: name }),

      resetIdentity: () => set({ mnemonic: null, publicKey: null, displayName: 'Phantm User', isOnboarded: false }),
    }),
    {
      name: 'phantm-identity',
    }
  )
);

export { WORD_LIST };
