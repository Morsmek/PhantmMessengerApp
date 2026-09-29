import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useIdentityStore } from '@/stores/identityStore';
import { useToastStore } from '@/stores/toastStore';

const BIP39_WORDS = new Set([
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
  'expense','expert','explain','explode','explore','export','expose','express','extend','extra','eye','eyebrow',
  'fable','fabric','face','fact','factor','factory','faculty','fade','fail','faint','fair','faith',
  'fake','fall','false','fame','family','famous','fan','fancy','fantasy','far','farm','fashion',
  'fast','fat','fatal','fate','father','fatigue','fault','favor','fawn','fear','feast','feather',
  'feature','federal','fee','feed','feel','fellow','fence','festival','fetch','fever','few','fiber',
  'fiction','field','fierce','fifteen','fifth','fifty','fight','figure','file','fill','film','filter',
  'final','finance','find','fine','finger','finish','fire','firm','first','fish','fist','fit',
  'fix','flag','flame','flash','flat','flavor','flaw','flea','flee','fleet','flesh','flex',
  'flick','flight','fling','flip','float','flock','flood','floor','flop','flour','flow','flower',
  'flu','fluctuate','fluent','fluid','flush','flute','fly','foam','focus','fog','foil','fold',
  'folk','follow','fond','food','fool','foot','force','forest','forever','forge','forget','forgive',
  'fork','form','formal','format','former','fort','fortune','forum','fossil','foster','found','fountain',
  'four','fox','fracture','fragile','fragment','frame','frank','fraud','free','freeze','freight','frequent',
  'fresh','friend','fright','frog','from','front','frost','frown','frozen','fruit','fry','fuel',
  'full','fume','fun','function','fund','funeral','fungus','funny','fur','furious','furnace','furnish',
  'furrow','fury','fuse','fuss','future','gadget','gain','galaxy','gallery','game','gap','garage',
  'garden','garlic','garment','gas','gasp','gate','gather','gauge','gaze','gear','gem','gender',
  'gene','general','genius','genre','gentle','genuine','gesture','ghost','giant','gift','giggle','ginger',
  'giraffe','girl','give','glad','glance','glare','glass','glaze','gleam','glide','glimpse','globe',
  'gloom','glory','glove','glow','glue','gnome','go','goal','goat','gold','golf','gone',
  'good','goose','gorge','gorgeous','gorilla','gospel','gossip','govern','grab','grace','grade','gradual',
  'grain','grand','grant','grape','graph','grasp','grass','grateful','grave','gravity','gray','graze',
  'great','greed','green','greet','grew','grey','grid','grief','grill','grim','grin','grind',
  'grip','groan','grocery','groove','ground','group','grow','growth','grudge','guarantee','guard','guess',
  'guest','guide','guild','guilt','guinea','guitar','gulf','gum','gun','gust','gut','guy',
  'gym','habit','hail','hair','half','hall','halt','ham','hammer','hamster','hand','handle',
  'hang','happen','happy','harbor','hard','hardly','harm','harp','harvest','haste','hat','hatch',
  'hate','haul','haunt','have','hawk','hazard','head','heal','heap','hear','heart','heat',
  'heaven','heavy','hedge','heel','height','heir','helicopter','hell','hello','help','hen','hence',
  'herb','herd','here','hero','hide','high','hill','hint','hip','hire','history','hit',
  'hobby','hold','hole','holiday','hollow','holy','home','honest','honey','hood','hook','hope',
  'horn','horror','horse','hose','host','hot','hotel','hound','hour','house','hover','how',
  'however','hug','huge','hum','human','humble','humor','hundred','hunger','hunt','hurdle','hurl',
  'hurry','hurt','husband','hut','hybrid','hydrogen','hygiene','hymn','hyphen','ice','icon','idea',
  'ideal','identify','idiom','idle','idol','if','ignite','ignore','ill','image','imagine','impact',
  'imply','import','impose','impress','improve','impulse','in','inch','incident','include','income','increase',
  'index','indicate','indoor','industry','infant','infer','infinite','influence','inform','inhale','initial','inject',
  'injury','ink','inmate','inner','innocent','input','inquiry','insect','insert','inside','insight','insist',
  'inspect','inspire','install','instance','instead','insult','insure','intact','intend','intense','intent','interest',
  'interior','internal','internet','interpret','interrupt','interval','interview','intimate','into','intrigue','introduce','invade',
  'invent','invest','invite','involve','iron','island','isolate','issue','it','item','ivory','jack',
  'jacket','jade','jail','jam','january','jar','jaw','jazz','jealous','jeans','jelly','jeopardy',
  'jest','jet','jewel','job','jockey','join','joint','joke','jolly','journal','journey','joy',
  'judge','judo','jug','juice','july','jumble','jump','june','jungle','junior','junk','jury',
  'just','justice','justify','keen','keep','kettle','key','kick','kid','kidney','kill','kind',
  'king','kingdom','kiss','kit','kitchen','kite','kitten','knee','kneel','knife','knight','knit',
  'knob','knock','knot','know','label','labor','lace','lack','ladder','lady','lagoon','lake',
  'lamb','lame','lamp','land','lane','language','lantern','lap','large','laser','last','late',
  'later','latest','laugh','launch','laundry','lava','law','lawn','lawsuit','layer','lazy','lead',
  'leaf','league','leak','lean','leap','learn','lease','leather','leave','lecture','left','leg',
  'legal','legend','lemon','lend','length','lens','leopard','less','lesson','let','letter','level',
  'lever','liar','liberty','library','license','lid','lie','life','lift','light','like','likely',
  'lily','limb','limit','limp','line','link','lion','lip','liquid','list','listen','literal',
  'literature','little','live','liver','living','lizard','load','loaf','loan','lobby','lobster','local',
  'locate','lock','locust','lodge','log','logic','logo','lone','long','look','loop','loose',
  'lord','lose','loss','lot','lottery','loud','lounge','love','low','loyal','luck','lucrative',
  'luggage','lumber','lump','lunch','lung','lure','lurk','lush','luxury','lyric','machine','mad',
  'magazine','magic','magnet','maid','mail','main','maintain','major','make','mammal','man','manage',
  'mango','manner','mansion','manual','many','map','marathon','marble','march','margin','marine','mark',
  'market','marriage','marry','marsh','marshal','martial','marvel','mask','mass','mast','master','match',
  'mate','material','math','matrix','matter','mature','maximum','may','maybe','mayor','maze','meadow',
  'meal','mean','meantime','measure','meat','mechanic','medal','media','medical','medicine','medium','meet',
  'melody','melon','melt','member','memo','memorial','memory','men','mend','mental','mention','menu',
  'merchant','mercy','mere','merge','merit','merry','mesh','mess','message','metal','method','metric',
  'metro','microbe','midday','middle','midnight','midst','might','mild','mile','milk','mill','million',
  'mimic','mince','mind','mine','mineral','mingle','minimum','minister','minor','mint','minus','minute',
  'miracle','mirror','miser','misery','miss','missile','mission','mist','mix','moan','moat','mobile',
  'mock','mode','model','moderate','modern','modest','modify','module','moist','molar','mold','mole',
  'molecule','moment','money','monitor','monkey','month','mood','moon','moral','more','morning','mortal',
  'mosaic','mosque','mosquito','moss','most','moth','mother','motion','motive','motor','motto','mount',
  'mountain','mouse','mouth','move','movie','much','mud','muffin','mug','multiply','murder','murky',
  'muscle','museum','mushroom','music','must','mustard','mutual','myself','mystery','myth','nail','name',
  'nap','napkin','narrate','narrow','nasty','nation','native','nature','nausea','naval','navy','near',
  'neat','neck','need','needle','negative','neglect','nerve','nest','net','network','neutral','never',
  'new','news','next','nice','niche','niece','night','nine','ninja','noble','nobody','nod',
  'noise','nomad','none','noon','nor','norm','normal','north','nose','not','note','nothing',
  'notice','notion','novel','now','nowhere','nozzle','nuclear','number','nurse','nut','nutrition','nylon',
  'oak','oar','oasis','oath','obesity','obey','object','oblige','obscure','observe','obsess','obtain',
  'obvious','occasion','occupy','occur','ocean','october','odd','odor','off','offend','offer','office',
  'officer','offset','often','oil','okay','old','olive','omega','omen','omit','once','one',
  'onion','only','onset','open','operate','opinion','oppose','optic','option','orange','orbit','orchard',
  'ordeal','order','organ','organic','organism','orient','origin','orphan','ostrich','other','otter','ought',
  'ounce','our','out','outer','outlet','outline','output','outside','oval','oven','over','overt',
  'owe','owl','own','owner','oxygen','oyster','ozone','pace','pack','packet','pad','paddle',
  'page','pain','paint','pair','palace','pale','palm','pan','panda','panel','panic','paper',
  'parade','parcel','pardon','parent','park','parrot','part','party','pass','passage','passion','past',
  'paste','pastry','patch','path','patience','patient','patrol','patron','pause','pave','paw','pay',
  'peace','peach','peak','pear','pearl','peasant','pebble','peek','peel','peer','pen','penalty',
  'pencil','people','pepper','perceive','perfect','perform','perfume','perhaps','period','permit','person','persona',
  'persuade','pest','pet','petal','phase','phone','photo','phrase','physical','piano','pick','picnic',
  'picture','pie','piece','pier','pig','pigeon','pile','pill','pillar','pillow','pilot','pin',
  'pine','pink','pint','pioneer','pipe','pistol','pit','pitch','pity','pizza','place','placid',
  'plague','plain','plan','plane','planet','plank','plant','plasma','plate','plaza','plea','plead',
  'please','pledge','plenty','plight','plot','plow','pluck','plug','plum','plunge','plural','plus',
  'pocket','poem','poet','poetry','point','poison','poke','polar','pole','police','policy','polish',
  'polite','political','poll','pollen','polo','pond','pony','pool','poor','pop','pope','popular',
  'porch','pork','port','pose','position','positive','possess','possible','post','pot','potato','pouch',
  'pound','pour','powder','power','practice','praise','pray','preach','precious','predict','prefer','pregnant',
  'prelude','premier','prepare','prescribe','present','preserve','president','press','pretend','pretty','prevail','prevent',
  'prey','price','pride','priest','primary','prime','prince','princess','print','prior','prison','private',
  'prize','probe','problem','process','proclaim','produce','professor','profit','program','project','prolong','promote',
  'proof','propel','proper','prose','prospect','protect','protein','protest','proud','prove','provide','province',
  'provoke','public','pudding','puff','pull','pulse','pump','punch','punish','pupil','puppy','purchase',
  'pure','purple','purpose','purse','push','put','puzzle','pyramid','quaint','quake','qualify','quality',
  'quantity','quarrel','quarter','queen','query','quest','question','quick','quiet','quill','quilt','quit',
  'quite','quiz','quota','quote','rabbit','race','rack','radar','radio','raft','rage','raid',
  'rail','rain','raise','rally','ranch','random','range','rank','rapid','rare','rash','rat',
  'rate','rather','raven','raw','ray','razor','reach','react','read','ready','real','realm',
  'reap','rear','reason','rebel','recall','receive','recent','recess','recipe','reckon','record','recruit',
  'red','redeem','reduce','reed','reef','reel','refer','refine','reflect','reform','refrain','refuge',
  'refund','refuse','regain','regard','regime','region','regret','regular','reign','reject','relate','relax',
  'relay','release','relief','rely','remain','remark','remedy','remind','remote','remove','render','renew',
  'rent','repair','repeat','replace','reply','report','repose','represent','reptile','request','require','rescue',
  'research','resemble','reserve','reside','resign','resist','resolve','resort','resource','respect','respond','rest',
  'restaurant','result','resume','retail','retain','retire','retreat','return','reunion','reveal','revenge','revenue',
  'reverse','review','revise','revive','revolt','reward','rhyme','rib','ribbon','rice','rich','rid',
  'ride','ridge','rifle','right','rigid','ring','rinse','riot','rip','ripe','rise','risk',
  'ritual','rival','river','road','roam','roar','roast','rob','robe','robin','robot','robust',
  'rock','rocket','rod','rode','role','roll','romance','roof','room','root','rope','rose',
  'rotate','rough','round','route','routine','row','royal','rub','rubber','rude','rug','ruin',
  'rule','ruler','rumor','run','rural','rush','rust','ruthless','rye','sack','sacred','sad',
  'saddle','safe','safety','saga','sail','saint','sake','salad','salary','sale','salmon','salon',
  'salt','salute','same','sample','sand','sandal','sandwich','sane','sang','sank','sarcasm','sash',
  'satellite','satisfy','sauce','sausage','save','savor','saw','say','scale','scan','scar','scare',
  'scarf','scene','scent','schedule','scheme','school','science','scissors','scold','scoop','scope','score',
  'scorn','scout','scramble','scrap','scrape','scratch','scream','screen','screw','script','scroll','scrub',
  'scuba','sculpture','sea','seal','search','season','seat','second','secret','section','sector','secure',
  'see','seed','seek','seem','segment','seize','select','self','sell','send','senior','sense',
  'sensor','sentence','sentinel','separate','sequence','serene','series','serious','serve','service','session','set',
  'settle','seven','sever','severe','sew','shade','shadow','shake','shall','shallow','shame','shape',
  'share','shark','sharp','shave','shear','shed','sheep','sheet','shelf','shell','shelter','shepherd',
  'sheriff','shield','shift','shine','ship','shirt','shiver','shock','shoe','shoot','shop','shore',
  'short','shot','should','shout','show','shower','shred','shrimp','shrine','shrink','shrub','shrug',
  'shuffle','shut','shy','sick','side','siege','sigh','sight','sign','signal','signature','signify',
  'silent','silk','silly','silver','similar','simple','sin','since','sing','singer','single','sink',
  'sister','sit','site','situate','six','size','skate','sketch','ski','skill','skin','skip',
  'skirt','skull','sky','slab','slam','slap','slash','slate','slave','sleep','sleeve','slice',
  'slide','slight','slim','slip','slogan','slope','slot','slow','slug','slum','sly','small',
  'smart','smash','smell','smile','smoke','smooth','snack','snail','snake','snap','sneak','sneeze',
  'sniff','snow','soak','soap','soar','soccer','social','sock','socket','soda','sofa','soft',
  'soil','solar','soldier','sole','solid','solo','solve','some','son','song','soon','sore',
  'sorrow','sort','soul','sound','soup','source','south','space','spade','spare','spark','sparrow',
  'sparse','spawn','speak','spear','special','species','spectacle','spectrum','speech','speed','spell','spend',
  'sphere','spice','spider','spike','spill','spin','spine','spirit','spit','spite','splash','split',
  'spoil','sponge','spoon','sport','spot','spouse','spray','spread','spring','sprout','spur','spy',
  'square','squash','squat','squeak','squeeze','squirrel','stab','stable','stack','stadium','staff','stage',
  'stain','stair','stake','stale','stalk','stall','stamina','stamp','stand','star','stare','start',
  'starve','state','static','station','statue','status','stay','steady','steak','steal','steam','steel',
  'steep','steer','stem','step','stereo','stern','stew','stick','stiff','still','sting','stir',
  'stitch','stock','stomach','stone','stool','stop','store','storm','story','stove','straight','strain',
  'strand','strange','strap','strategy','straw','stray','streak','stream','street','strength','stress','stretch',
  'strict','stride','strike','string','strip','strive','stroke','stroll','strong','structure','struggle','student',
  'studio','study','stuff','stumble','stump','stun','stunt','style','subject','submit','subscribe','subtle',
  'suburb','subway','succeed','such','suck','sudden','sue','suffer','sugar','suggest','suit','sulfur',
  'sultan','sum','summit','summon','sun','super','supper','supply','support','supreme','sure','surface',
  'surge','surgeon','surgery','surpass','surplus','surprise','surrender','surround','survey','survive','suspect','suspend',
  'sustain','swallow','swamp','swan','swarm','swear','sweat','sweep','sweet','swell','swift','swim',
  'swing','swirl','switch','sword','swore','symbol','sympathy','symptom','syrup','system','table','tablet',
  'tackle','tactic','tag','tail','tailor','take','tale','talent','talk','tall','tame','tank',
  'tap','tape','target','task','taste','tattoo','taxi','tea','teach','team','tear','tease',
  'tech','teen','teeth','tell','temper','temple','tempo','tempt','ten','tenant','tend','tender',
  'tennis','tent','term','termite','terrace','terrain','terrible','terror','test','text','than','thank',
  'that','theater','theme','then','theory','therapy','there','these','thesis','they','thick','thief',
  'thigh','thin','thing','think','third','thirst','thirty','this','thorn','those','thought','thread',
  'threat','three','thrift','thrill','thrive','throat','throne','throng','through','throw','thrust','thumb',
  'thunder','thus','tick','ticket','tide','tidy','tie','tiger','tight','tile','till','tilt',
  'timber','time','tin','tiny','tip','tire','tissue','title','toast','tobacco','today','toe',
  'together','toilet','token','tolerant','toll','tomato','tomb','tone','tongue','tonight','too','tool',
  'tooth','top','topic','torch','tornado','tortoise','toss','total','touch','tough','tour','toward',
  'towel','tower','town','toxic','toy','trace','track','tract','trade','traffic','tragic','trail',
  'train','trait','tram','tramp','trance','trap','trash','trauma','travel','tray','tread','treasure',
  'treat','tree','tremble','trend','trial','tribe','trick','tried','trigger','trim','trip','triple',
  'troop','trophy','trouble','trouser','truck','true','trumpet','trunk','trust','truth','try','tube',
  'tuck','tuition','tulip','tumble','tuna','tune','tunnel','turkey','turn','turtle','tutor','twelve',
  'twenty','twice','twin','twist','type','typical','ugly','ulcer','ultimate','umbrella','unable','uncle',
  'under','undo','uneasy','unfair','unfold','unhappy','uniform','union','unique','unit','unite','unity',
  'universal','universe','university','unknown','unless','unlike','until','unusual','upon','upper','uproar','upset',
  'urban','urge','urgent','usage','use','used','useful','usher','usual','utensil','utility','utilize',
  'utmost','utter','vacant','vacation','vacuum','vague','vain','valid','valley','valuable','value','valve',
  'van','vanish','vapor','variable','variant','variety','various','vary','vase','vast','vault','vector',
  'vegetable','vehicle','veil','vein','velocity','velvet','vendor','venture','verb','verdict','verify','version',
  'vertical','very','vessel','vest','veteran','veto','viable','vibrant','vicious','victim','victory','video',
  'view','village','villain','vine','vinegar','violate','violent','violet','violin','virtual','virtue','virus',
  'visible','vision','visit','visual','vital','vivid','vocal','voice','void','volcano','volume','volunteer',
  'vote','vowel','voyage','vulgar','wage','wagon','waist','wait','wake','walk','wall','walnut',
  'wander','want','war','ward','warm','warn','warp','warrant','warrior','wash','wasp','waste',
  'watch','water','wave','wax','way','weak','wealth','weapon','wear','weary','weather','weave',
  'wedding','wedge','weed','week','weekend','weigh','weight','weird','welcome','well','west','wet',
  'whale','what','wheat','wheel','when','where','whether','which','while','whip','whirl','whisper',
  'whistle','white','who','whole','why','wicked','wide','widow','width','wife','wild','will',
  'willing','willow','win','wind','window','wine','wing','wink','winner','winter','wipe','wire',
  'wisdom','wise','wish','wisp','wit','witch','with','within','without','witness','wolf','woman',
  'wonder','wood','wool','word','work','world','worm','worry','worse','worship','worst','worth',
  'would','wound','wrap','wrath','wreck','wrestle','wrist','write','wrong','wrote','xenon','xerox',
  'yacht','yard','yarn','yawn','year','yeast','yell','yellow','yes','yesterday','yield','yoga',
  'yogurt','young','youth','zebra','zenith','zero','zest','zigzag','zinc','zone','zoo','zoom'
]);

export function RecoverScreen() {
  const navigate = useNavigate();
  const recoverIdentity = useIdentityStore((s) => s.recoverIdentity);
  const addToast = useToastStore((s) => s.addToast);
  const [input, setInput] = useState('');

  const parsedWords = useMemo(() => {
    return input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }, [input]);

  const wordStatuses = useMemo(() => {
    return parsedWords.map((w) => BIP39_WORDS.has(w));
  }, [parsedWords]);

  const allValid = parsedWords.length === 20 && wordStatuses.every(Boolean);

  const handleRecover = () => {
    const phrase = parsedWords.join(' ');
    const success = recoverIdentity(phrase);
    if (success) {
      addToast('Identity recovered!', 'success');
      navigate('/chats', { replace: true });
    } else {
      addToast('Invalid recovery phrase. Please check your words.', 'error');
    }
  };

  return (
    <div
      className="flex flex-col min-h-[100dvh]"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={() => navigate('/welcome')} className="p-2 -ml-2" aria-label="Back">
          <ChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      <div className="flex-1 px-5 pb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Recover Identity
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Enter your 20-word recovery phrase to restore your account.
        </p>

        <div className="mt-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your 20-word recovery phrase..."
            className="w-full rounded-xl p-4 text-base outline-none resize-none"
            style={{
              background: 'var(--bg-surface)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              border: '1px solid var(--text-muted)',
              minHeight: 160,
            }}
          />
        </div>

        {parsedWords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {parsedWords.map((word, i) => (
              <span
                key={i}
                className="text-sm px-2 py-1 rounded"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: wordStatuses[i] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: wordStatuses[i] ? 'var(--success)' : 'var(--error)',
                  textDecoration: wordStatuses[i] ? 'none' : 'underline',
                  textDecorationColor: 'var(--error)',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
          {parsedWords.length} of 20 words
        </p>

        <button
          onClick={handleRecover}
          disabled={!allValid}
          className="w-full h-14 rounded-xl text-base font-semibold mt-6 transition-all"
          style={{
            background: allValid ? 'var(--accent-pink)' : 'var(--text-muted)',
            color: allValid ? '#1A1218' : 'var(--bg-primary)',
            opacity: allValid ? 1 : 0.5,
          }}
        >
          Recover
        </button>
      </div>
    </div>
  );
}
