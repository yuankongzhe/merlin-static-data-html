// pages/index.js

import { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { differenceInCalendarDays } from 'date-fns';
import CircularProgressBar from '../components/CircularProgressBar';
const CurrencyCard = ({ currencyName, staked, btcPrice, inputPrice ,isBrc20Token,isBrc420Token,totalSupply,totaltvl}) => {

  const priceInTotal = isBrc20Token ? staked * inputPrice * btcPrice *0.00000001 : isBrc420Token ? staked * inputPrice * btcPrice : staked * inputPrice;
  const unit = isBrc20Token ? ' sats/'+currencyName : isBrc420Token ?  'BTC' : ' /U';

  return (
    <div className='col-md-3  g-2' style={{ 'minWidth': "260px"  }}>
    <div className='card   h-100 shadow  bg-body rounded' >
        <div className="card-header text-center text-dark" style={{ 'backgroundColor': "white"  }}>

        {currencyName}
      </div>
      <div className="card-body row ms-1  ">
        <div className='row container'>
        <div className='col-8'>
          <p className="card-text" style={{ color: "#8540F5"  }}>
            TVL USD:  
          </p>
          <p className='h5 strong' style={{ color: "#8540F5"  }}>{formatNumber(priceInTotal.toFixed(0))}</p>
        </div>
        <div className='col-4'>

          <div className='row' style={{  minWidth: '120px' }}>
          
          <CircularProgressBar 
          percent={(priceInTotal / totaltvl * 100).toFixed(2)} 
          circleClass="#C29FFA"
          textClass="#8540F5"
          />

          </div>

        </div>
        </div>
        <div className='row'>
        <div className='col-8'>
        <p className='' style={{ color: "#3D8BFD"  }}>质押数量: </p>
          <p className='h5 strong' style={{ color: "#3D8BFD"  }}>{formatNumber(staked.toFixed(0))}</p>
        </div>
        <div className='col-4'>
        {totalSupply && (
        <div className='row' style={{  minWidth: '100px' }}>
          
          <CircularProgressBar 
          percent={(staked / totalSupply * 100).toFixed(2)} 
          circleClass="#9EC5FE"
          textClass="#3D8BFD"
          />
          
        </div>
        )}
        </div>
        <p className="card-text container text-muted text-end">
            单价: {formatNumber(inputPrice)}  {unit}
          </p>
        </div>
        

    </div>

    </div>
    </div>

  );
};


const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
const HomePage = () => {
  const [currencyList,setcurrencyList] = useState(null);
  const [currency420List,setcurrency420List] = useState(null);
  const [currencyordiList,setcurrencyordiList] = useState(null);
  const [evmdata, evmsetData] = useState(null);
  const [btcdata, btcsetData] = useState(null);
  const [brc20data, brc20setData] = useState(null);
  const [brc420data, brc420setData] = useState(null);
  const [ordidata, ordisetData] = useState(null);
  const [sumdata, sumsetData] = useState(null);
  const [predicted_tvl_usd, setpredicted_tvl_usd] = useState(null);
  // 设置状态
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0); 
  const [d, setD] = useState(0); 
  const [e, setE] = useState(0); 
  const [selectedDate, setSelectedDate] = useState('');
  const [specifiedDate1,setspecifiedDate1] = useState('2024-04-01'); // 指定日期
  const [differencedate, setdifferencedate] = useState(null);
  const [control,setcontrol]=useState(null);
  const [isToggled, setIsToggled] = useState(false);

  // Function to update the currency price and recalculate TVL

  useEffect(() => {
    const filename = 'evm_stakedsum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        evmsetData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'btc_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        btcsetData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'brc20_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        brc20setData(evmdata);
        setcurrencyList(Object.keys(evmdata.data));
      });
  }, []);
  useEffect(() => {
    const filename = 'brc420_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        brc420setData(evmdata);
        setcurrency420List(Object.keys(evmdata.data));
      });
  }, []);
  useEffect(() => {
    const filename = 'ordi_staked_balance_sum'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        ordisetData(evmdata);
        setcurrencyordiList(Object.keys(evmdata.data));
      });
  }, []);
  useEffect(() => {
    const filename = 'sum_usd'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        sumsetData(evmdata);
      });
  }, []);
  useEffect(() => {
    const filename = 'predicted_tvl'; // 你想要读取的文件名（不包括.json扩展名）
    // 调用我们的API路由，并传递文件名
    fetch(`/api/${filename}`)
      .then(response => response.json())
      .then(evmdata => {
        // 将数据设置到状态中
        setpredicted_tvl_usd(evmdata);
      });
  }, []);
  function getDateXDaysAgo(x) {
    const today = new Date();
    today.setDate(today.getDate() - x);
  
    // 格式化日期为 YYYY-MM-DD
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (predicted_tvl_usd && predicted_tvl_usd.data) {
      // 现在可以安全地访问 predicted_tvl_usd.data

        const newDifferenceDate = e/d;
        setSelectedDate(getDateXDaysAgo(newDifferenceDate));
        

    }
    
  }, [e,d]);
  useEffect(() => {
    if (predicted_tvl_usd && predicted_tvl_usd.data) {
      // 现在可以安全地访问 predicted_tvl_usd.data
      if (specifiedDate1 && selectedDate) {
        const newDifferenceDate = differenceInCalendarDays(new Date(specifiedDate1), new Date(selectedDate));
        const total_date = differenceInCalendarDays(new Date(specifiedDate1), new Date('2024-02-08'));
        let Newsum = 0;
        for (let index = 0; index < total_date; index++) {
          if (predicted_tvl_usd.data.daily_predicted_tvl.hasOwnProperty(index.toString())) {
            Newsum += predicted_tvl_usd.data.daily_predicted_tvl[index.toString()];
          }
        }
        // console.log(b,'usd----')
        // console.log(newDifferenceDate,'diff_date')
        // console.log(Newsum,'sum')
        // console.log(Newsum/newDifferenceDate)
        setpredicted_tvl_usd({
          ...predicted_tvl_usd,
          data: { ...predicted_tvl_usd.data, predicted_tvl_usd: Newsum }
        });
        setdifferencedate(newDifferenceDate);
        setC((b * newDifferenceDate) / Newsum * 420000000);
        setcontrol('yes');
      }
    }
    
  }, [specifiedDate1,selectedDate]);
  useEffect(() => {
    // 使用 setTimeout 来等待 DOM 元素确实可用
    const timer = setTimeout(() => {
      const toastElList = [].slice.call(document.querySelectorAll('.toast'));
      const toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
      });
      toastList.forEach(function(toast) {
        toast.show();
      });
    }, 500); // 延迟 500 毫秒后初始化 Toasts

    return () => clearTimeout(timer);  // 清除定时器以避免内存泄漏
  }, []);
  // 如果数据还没加载，显示加载状态
  if (!evmdata) return <div>Loading...</div>;
  if (!btcdata) return <div>Loading...</div>;
  if (!brc20data) return <div>Loading...</div>;
  if (!sumdata) return <div>Loading...</div>;
  
  const CurrencyevmCards = Object.keys(evmdata.data).map(currencyName => {
    const staked = evmdata.data[currencyName].staked;
    // console.log(staked);
    const inputPrice =  evmdata.data[currencyName].price;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={evmdata.data[currencyName].price_in_usd}
        inputPrice={inputPrice}

        isBrc20Token={false}
        isBrc420Token={false}
        totaltvl={sumdata.data.sum_usd.toFixed(0)}
      />
    );
  });
  if (!currencyordiList  ) return <div>Loading...</div>;
  if (!currencyList  ) return <div>Loading...</div>;
  if (!currency420List  ) return <div>Loading...</div>;
  const Currency20Cards = currencyList
  .sort((a, b) => {
    // console.log(currencyList)
    const ratioA20 = brc20data.data[a].staked / brc20data.data[a].totalSupply;
    const ratioB20 = brc20data.data[b].staked / brc20data.data[b].totalSupply;
    return ratioB20 - ratioA20  ;
  })
  .map((currencyName) => {
    const staked = brc20data.data[currencyName].staked;
    const inputPrice =  brc20data.data[currencyName].price_sat;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}

        isBrc20Token={true}
        isBrc420Token={false}
        totalSupply={brc20data.data[currencyName].totalSupply}
        totaltvl={sumdata.data.sum_usd.toFixed(0)}
      />
    );
  });
  const CurrencyordiListCards = currencyordiList
  .sort((a, b) => {
    const ratioA = ordidata.data[a].staked / ordidata.data[a].totalSupply;
    const ratioB = ordidata.data[b].staked / ordidata.data[b].totalSupply;
    return ratioB - ratioA  ;
  })
  .map((currencyName) => {
    const staked = ordidata.data[currencyName].staked;
    const totalSupply = ordidata.data[currencyName].totalSupply;
    const inputPrice =  ordidata.data[currencyName].price_btc;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}

        isBrc20Token={false}
        isBrc420Token={true}
        totalSupply={totalSupply}
        totaltvl={sumdata.data.sum_usd.toFixed(0)}
      />
    );
  });
  const Currency420Cards = currency420List
  .sort((a, b) => {
    const ratioA = brc420data.data[a].staked / brc420data.data[a].totalSupply;
    const ratioB = brc420data.data[b].staked / brc420data.data[b].totalSupply;
    return ratioB - ratioA  ;
  })
  .map((currencyName) => {
    const staked = brc420data.data[currencyName].staked;
    const totalSupply = brc420data.data[currencyName].totalSupply;
    const inputPrice =  brc420data.data[currencyName].price_btc;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}

        isBrc20Token={false}
        isBrc420Token={true}
        totalSupply={totalSupply}
        totaltvl={sumdata.data.sum_usd.toFixed(0)}
      />
    );
  });
  // 当a变化时，更新b和c
  const handleAChange = (event) => {
    const newA = event.target.value;
    setA(newA);
    const calculatedB = newA * btcdata.data.BTC.price;
    setB(calculatedB);
    setD(newA*10000);
    setC(calculatedB *differencedate /predicted_tvl_usd.data.predicted_tvl_usd * 420000000);
  };

  // 当b变化时，更新a和c
  const handleBChange = (event) => {
    const newB = event.target.value;
    setB(newB);
    const calculatedA = newB / btcdata.data.BTC.price;
    setA(calculatedA);
    setD(calculatedA*10000);
    setC(Number(newB) *differencedate /predicted_tvl_usd.data.predicted_tvl_usd* 420000000);
  };
  const handleDChange = (event) => {
    const newD = event.target.value;
    setD(newD);
    const calculatedA = newD / 10000;
    const calculatedB = newD * btcdata.data.BTC.price/10000;
    setA(calculatedA);
    setB(calculatedB);
    setC(Number(calculatedB) *differencedate /predicted_tvl_usd.data.predicted_tvl_usd* 420000000);
  };
  const handleEChange = (event) => {
    const newE = event.target.value;
    setE(newE);
  };
  const handledateChange = (event) => {
    const inputDate = event.target.value;
    setSelectedDate(inputDate);
    // 剩下的逻辑将移至 useEffect
  };
  
  const handlespecifiedDate1Change = (event) => {
    const inputDate = event.target.value;
    setspecifiedDate1(inputDate);
    // 剩下的逻辑将移至 useEffect
  };
  
  // useEffect 来处理 selectedDate 的变化
  
  // Define a component to format the row data
  const calcother = ({  stakednum, gettokennum,totalmarketcap,sell_price,apycal,netreward,netprofit_ }) => {
    
    if (netprofit_) {
       totalmarketcap = stakednum * netprofit_ / gettokennum * 21;
       sell_price = stakednum * netprofit_ / gettokennum;
       apycal =  netprofit_ * 100 / differencedate * 365;
       netreward = netprofit_ * stakednum;
    }
    else if (totalmarketcap){
       sell_price = totalmarketcap/21;
       apycal = totalmarketcap / 21 * gettokennum / stakednum *100 / differencedate * 365;
       netreward = totalmarketcap / 21 * gettokennum;
       netprofit_ = totalmarketcap / 21 * gettokennum / stakednum;
    }
    else if (sell_price) {
       totalmarketcap = sell_price * 21; 
       netreward = sell_price * gettokennum;
       apycal = netreward/stakednum/ differencedate * 365 *100;
       netprofit_ = netreward/stakednum;
    }
    else if (apycal) {
       netprofit_ = apycal*differencedate/365;
       netreward = netprofit_ * stakednum;
       totalmarketcap = stakednum * netprofit_ / gettokennum * 21;
       sell_price = totalmarketcap / 21;
       apycal=apycal*100
    }
    else if (netreward) {
      sell_price = netreward / gettokennum;
      totalmarketcap = sell_price * 21;
      apycal = netreward/stakednum/ differencedate * 365 *100;
      netprofit_ = apycal*differencedate/365;
    }
    return {  stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_ }
  };
  const TableRow = ({ index, totalmarketcap, sell_price, apycal, netreward, netprofit_ }) => (
    <tr className={`table-${netprofit_<10 ? 'danger' :netprofit_<50 ? 'warning' : netprofit_<100  ? 'info' : 'success'}`}>
      <th scope="row">{index}</th>
      <td>{formatNumber((totalmarketcap).toFixed(2))}亿</td>
      <td>{formatNumber((sell_price).toFixed(3))}</td>
      <td>{formatNumber((apycal).toFixed(2))}%</td>
      <td>{formatNumber((netreward).toFixed(0))}</td>
      <td>{formatNumber((netprofit_).toFixed(2))}%</td>
    </tr>
  );
  const other_addressList  = [
    // stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_
    { 'address_info': '本站站长推特', 'address_link': 'https://twitter.com/0xfaskety','color': '', },
    { 'address_info': '本站开源地址', 'address_link': 'https://github.com/yuankongzhe/merlin-static-data-html','color': '', },
    { 'address_info': '其他Merlin看板网站1', 'address_link': 'https://bitmap.date/merlin/','color': '',},
    { 'address_info': '其他Merlin看板网站2', 'address_link': 'https://geniidata.com/ordinals/index/merlin','color': '',},
    { 'address_info': 'Merlin 跨链桥（Meson）', 'address_link': 'https://meson.fi/','color': '', },
    { 'address_info': 'Merlin Swap', 'address_link': 'https://merlinswap.org/home','color': '', },
    // ...更多条目...
  ];
  const official_addressList  = [
    // stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_
    { 'address_info': 'Melin 官网', 'address_link': 'https://merlinchain.io/','color': '', },
    { 'address_info': 'Merlin Seal 质押官网', 'address_link': 'https://merlinchain.io/bridge/staking','color': '', },
    { 'address_info': 'Merlin 官方wiki', 'address_link': 'https://merlinchain.notion.site/Merlin-Chain-Wiki-8c634e006879462f85bec77f19cb98eb','color': '',},
    { 'address_info': 'Merlin 官方推特', 'address_link': 'https://twitter.com/MerlinLayer2','color': '',},
    { 'address_info': 'Merlin 主要创始人推特', 'address_link': 'https://twitter.com/BitmapTech','color': '', },
    { 'address_info': 'Merlin Seal 官方活动细则', 'address_link': 'https://medium.com/@merlinchaincrypto/merlins-seal-the-biggest-fair-launch-of-layer2-5614001b2582','color': '', },
    // ...更多条目...
  ];

  const addressTable = (addressList) =>{
  // Return sorted results within a table structure
  return (

      <tbody>
        {addressList.map((data, index) => (
          <tr className={`table-${data.color}`} key={`table-address-${index}`}>
            <td className='col-md-4 col-ms-12 text-break'><span className='text-black'>{data.address_info}</span></td>
            <td className='col-md-8 col-ms-12 text-break'><a href={data.address_link} target="_blank" rel="noopener noreferrer">
            {data.address_link}
            </a></td>
          </tr>
        ))}
      </tbody>

  );
    };

    const MerlinActivity = () =>{
      const activity_data  = [
        // stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_
        {
          'activity_name': 'Merlin Seal',
          'activity_info': [
            '质押BTC、ETH、brc20、brc420等资产，瓜分4.2亿MERL。占 Merlin Chain 治理代币 $MERL 的 20%。',
            '这是所有 Layer2 中最大的质押奖励。'
          ],
          'activity_reward': '4.2亿MERL',
          'activity_course': {
            'videos': [
              {
                'description': '油管 超超web3 视频教程 (11:35处开始）',
                'link': 'https://youtu.be/skE3w22B8-w?si=CM8aJ9iQVV-SF8DD&t=695'
              },
              {
                'description': '油管 十一地主 视频教程',
                'link': 'https://www.youtube.com/watch?v=QsuOx0ais2w'
              },
              {
                'description': '推特 0xEfraim 视频教程（unisat钱包）',
                'link': 'https://x.com/0xEfraim/status/1755641701589545423?s=20'
              }
            ],
            'image_text': [
              {
                'description': '推特 比特里里 图文教程',
                'link': 'https://x.com/lilyanna_btc/status/1755581246871327038?s=20'
              },
              {
                'description': '推特 大狮兄 图文教程',
                'link': 'https://docs.google.com/document/d/1e3g4IaWO78GBq1gIre7fppUb0xHsmBLRGigYX0bwLBc/edit#heading=h.11fdsk1q9efx'
              },
              {
                'description': '微博 空投小企鹅 图文教程',
                'link': 'https://weibo.com/ttarticle/p/show?id=2309405000941257490564'
              },
            ],
          },
          'activity_date': [
            {
              'description': '资产质押持续时间：',
              'date': '02-08 至 04-21'
            },
            {
              'description': '资产在Merlin链解锁时间：',
              'date': '2024年2月'
            },
            {
              'description': 'MERL代币获得时间：',
              'date': '2024年3月'
            },
            {
              'description': '资产解除质押时间：',
              'date': '2024年4月21日'
            },
          ],
          'activity_link': [
            {
              'description': 'Merlin Seal 活动官网：',
              'link': 'https://merlinchain.io/bridge/staking',
            },
            {
              'description': 'Merlin Seal 官方活动细则：',
              'link': 'https://medium.com/@merlinchaincrypto/merlins-seal-the-biggest-fair-launch-of-layer2-5614001b2582',
            },
          ]
        },
        {
          'activity_name': 'ZKFair launchpad',
          'activity_info': [
            '在ZKF链上消耗gas（USDC）、质押ZKF代币等方式，瓜分420万MERL。',
          '占 Merlin Chain 治理代币 $MERL 的 0.2%的launchpad。'
            ],
          'activity_reward': '420万MERL',
          'activity_course': {
            'videos': [
            ],
            'image_text': [
            ],
          },
          'activity_date': [
            {
              'description': 'launchpad持续时间：',
              'date': '02-18 至 03-31'
            },
          ],
          'activity_link': [
            {
              'description': '活动官网：',
              'link': 'https://zkfair.io/fairlaunch',
            },
            {
              'description': '官方活动细则：',
              'link': 'https://mirror.xyz/zkfair.eth/Uc0Ymz9S8MaSpQNSlv-049lhF9LoYscL1fOm2v8wUSU',
            },
          ],
        },
        {
          'activity_name': 'MerlinSwap',
          'activity_info': [
            '在MerlinSwap上进行转账、交易、提供流动性等活动，瓜分1680万MERL',
            '占 Merlin Chain 治理代币 $MERL 的 0.8%的活动',
            '所有活动发布前，在MerlinSwap上进行的转账、交易、提供流动性等活动都会被记录',
          ],
          'activity_reward': '1680万MERL',
          'activity_course': {
            'videos': [
              {
                'description': '油管 超超web3 视频教程 (30:00处开始）',
                'link': 'https://youtu.be/skE3w22B8-w?si=CM8aJ9iQVV-SF8DD&t=1800'
              },

            ],
            'image_text': [
              {
                'description': '微博 空投小企鹅 图文教程',
                'link': 'https://weibo.com/ttarticle/p/show?id=2309405005000404500510'
              },
            ],
          },
          'activity_date': [
            {
              'description': '活动持续时间：',
              'date': '敬请期待'
            },
            
          ],
          'activity_link': [
            {
              'description': 'MerlinSwap官网：',
              'link': 'https://merlinswap.org/trade/swap',
            },
            {
              'description': '活动简易公告：',
              'link': 'https://twitter.com/BitmapTech/status/1760955139505160565',
            },
          ]
        },
        {
          'activity_name': 'MerlinStarter',
          'activity_info': [
            '连接钱包，绑定账号获得积分',
            '给Merlin Staker直接进行空投',
            '注意本活动索要推特权限较大，及时取消授权',
            '取消授权方法“更多--设置和隐私--安全性和账号访问权限--已连接的应用”',
          ],
          'activity_reward': '平台代币STAR / Mineral抽奖空投',
          'activity_course': {
            'videos': [
            ],
            'image_text': [
              {
                'description': '推特 0xfaskety 图文教程',
                'link': 'https://x.com/0xfaskety/status/1763405816605102147?s=20'
              },
              {
                'description': '微博 空投小企鹅 图文教程',
                'link': 'https://weibo.com/ttarticle/p/show?id=2309405007226531086505'
              },
            ],
          },
          'activity_date': [
            {
              'description': '活动持续时间：',
              'date': '敬请期待'
            },
            
          ],
          'activity_link': [
            {
              'description': '平台代币STAR活动官网：',
              'link': 'https://airdrop.merlinstarter.com/?code=lt83foygeuizgjtve38',
            },
            {
              'description': '平台代币STAR活动简易细则：',
              'link': 'https://docs.merlinstarter.com/protocol/airdrop',
            },
            {
              'description': 'Mineral抽奖空投活动官网：',
              'link': 'https://airdrop.merlinstarter.com/mineral',
            },
            {
              'description': 'Mineral抽奖空投活动简易细则：',
              'link': 'https://medium.com/@MerlinStarter/merlin-starter-x-mineral-a-strategic-collaboration-unveiled-a451d1ccb566',
            },
          ]
        },
        {
          'activity_name': 'influpia',
          'activity_info': [
            'socialfi',
            '通过邀请码进入后，进行抽奖（邀请码可以在discord中获取）',
            '可以通过邀请最多额外获得12次抽奖机会',
            '如果在03/11 00:00 UTC+8前在Merlin Seal中质押超过 0.001 BTC，每天额外获得一次抽奖机会',
          ],
          'activity_reward': '平台代币',
          'activity_course': {
            'videos': [
            ],
            'image_text': [
            ],
          },
          'activity_date': [
            {
              'description': '活动持续时间：',
              'date': '03/11开始'
            },
            
          ],
          'activity_link': [
            {
              'description': '活动官网：',
              'link': 'https://www.influpia.com/airdrop',
            },
            {
              'description': 'influpia官方推特',
              'link': 'https://twitter.com/influpia',
            },
            {
              'description': '官方discord',
              'link': 'https://discord.gg/influpia',
            },
            {
              'description': 'influpia官方活动细则',
              'link': 'https://medium.com/@influpia/airdrop-is-now-live-88a7bd0b16fc',
            },
          ]
        },
        // ...更多条目...
      ];
  
    // Return sorted results within a table structure
    return (
  
      <div className="accordion" id="accordionPanelsStayOpenExample">
<div className="accordion-item" key={-1}>
          <h2 className="accordion-header" id={`heading${-1}`}>
            <button className="accordion-button collapsed"  type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${-1}`} aria-expanded="false" aria-controls={`collapse${-1}`}>
              <span className=''>{0}. 钱包安全相关</span> 
            </button>
          </h2>
          <div id={`collapse${-1}`} className="accordion-collapse collapse" aria-labelledby={`heading${-1}`}>
            <div className="accordion-body row">
              {/* Activity Info */}
              <div className='col-md-6 col-ms-12'>
                <h4>钱包安全相关教程</h4>
                <li key={`Activitycourse${-1}`}><strong><em>推特 比特里里 Merlin钱包基础安全知识 : </em></strong><a href="https://x.com/lilyanna_btc/status/1763600093075415306?s=20"  target="_blank" rel="noopener noreferrer">点击跳转</a></li>
                <li key={`Activitycourse${-1}`}><strong><em>推特 0xfaskety Merlin钱包取消合约授权教程 : </em></strong><a href="https://x.com/0xfaskety/status/1764078620858101980?s=20"  target="_blank" rel="noopener noreferrer">点击跳转</a></li>
              </div>
              <div className='col-md-6 col-ms-12'>
                {/* Activity Dates and Links */}
                <h4 id={`activity-link-${-1}`}>Merlin安全工具相关链接</h4>
                <li key={`Activitycourse${-1}`}><strong><em>OKX网页钱包（用于取消合约授权） : </em></strong><a href="https://www.okx.com/cn/web3"  target="_blank" rel="noopener noreferrer">点击跳转</a></li>
                {/* Map through dates and links here */}
              </div>
            </div>
          </div>
        </div>

        {activity_data.map((activity, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header" id={`heading${index}`}>
            <button className="accordion-button collapsed"  type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>

              <span className=''>{index + 1}. {activity.activity_name}   ————</span> 
              <span className=' strong  text-primary text-end'>{activity.activity_reward}</span>

            </button>
          </h2>
          <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${index}`}>
            <div className="accordion-body row">
              {/* Activity Info */}
              <div className='col-md-6 col-ms-12'>
                <h4>活动简介</h4>
                <ul>
                {activity.activity_info.map((info) => (
                    <li key={`activity_info${index}`}>{info}</li> // 假设info是一个对象，有key和text属性
                ))}
                </ul>
                <h4>活动教程</h4>
                <div class="accordion accordion-flush" id={`Activitycourse${index}`}>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id={`Activitycourse${index}-headingOne`}>
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#Activitycourse${index}-collapseOne`} aria-expanded="false" aria-controls={`Activitycourse${index}-collapseOne`}>
                        视频教程
                      </button>
                    </h2>
                    <div id={`Activitycourse${index}-collapseOne`} class="accordion-collapse collapse" aria-labelledby={`Activitycourse${index}-headingOne`} data-bs-parent={`#Activitycourse${index}`}>
                      <div class="accordion-body">
                      {activity.activity_course && activity.activity_course.videos && activity.activity_course.videos.length > 0 && activity.activity_course.videos.map((data) => (
                          <li key={`Activitycourse${index}`}><strong><em>{data.description} : </em></strong><a href={data.link}  target="_blank" rel="noopener noreferrer">点击跳转</a></li>
                      ))}                
                      <li key={`Activitycourse${index}`}>更多教程敬请期待...</li>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id={`Activitycourse${index}-headingTwo`}>
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#Activitycourse${index}-collapseTwo`} aria-expanded="false" aria-controls={`Activitycourse${index}-collapseTwo`}>
                        图文教程
                      </button>
                    </h2>
                    <div id={`Activitycourse${index}-collapseTwo`} class="accordion-collapse collapse" aria-labelledby={`Activitycourse${index}-headingTwo`} data-bs-parent={`#Activitycourse${index}`}>
                      <div class="accordion-body">
                      {activity.activity_course && activity.activity_course.image_text && activity.activity_course.image_text.length > 0 && activity.activity_course.image_text.map((data) => (
                          <li key={`Activitycourse${index}`}><strong><em>{data.description} : </em></strong><a href={data.link}  target="_blank" rel="noopener noreferrer">点击跳转</a></li>
                      ))}                           
                      <li key={`Activitycourse${index}`}>更多教程敬请期待...</li>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-6 col-ms-12'>
                <h4 id={`activity-time-${index}`}>活动时间表</h4>
                <ul>
                  {activity.activity_date.map((info) => (
                    <li key={`activity_date${index}`}><strong><em>{info.description}</em></strong>{info.date}</li>
                  ))}
                </ul>
                {/* Activity Dates and Links */}
                <h4 id={`activity-link-${index}`}>活动相关链接</h4>
                {activity.activity_link.map((info) => (
                    <li key={`activity_link${index}`}><strong><em>{info.description}</em></strong><a href={info.link}  target="_blank" rel="noopener noreferrer">点击跳转</a></li>
                  ))}
                {/* Map through dates and links here */}
              </div>
            </div>
          </div>
        </div>
      ))}
      
    </div>
  
    );
      };
  const handleToggle = () => {
        setIsToggled(!isToggled);
      };
  const caltable = () =>{
    const dataList  = [
      // stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_
      // { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.05},
      // { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.10},
      // { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.20},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.50},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':1.00},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':2.00},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':5.00},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':10.00},
      // { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':10.00},
      // { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':20.00},
      { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':50.00},
      { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':100.00},
      // { 'stakednum': b, 'gettokennum': c, 'sell_price':0.5},
      // { 'stakednum': b, 'gettokennum': c, 'sell_price':1},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':2},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':2.9},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':3.3},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':5},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':10},
      // { 'stakednum': b, 'gettokennum': c, 'apycal':0.5},
      // { 'stakednum': b, 'gettokennum': c, 'apycal':1.0},
      // { 'stakednum': b, 'gettokennum': c, 'apycal':2.0},
      { 'stakednum': b, 'gettokennum': c, 'apycal':5.0},
      { 'stakednum': b, 'gettokennum': c, 'apycal':10},
      // ...更多条目...
    ];
  // 添加开关状态

  // 将字典的每个项转换为 `calcother` 函数的参数，并调用函数
  const results = dataList.map(item => calcother(item));
  // 处理开关变化

  // 根据 `totalmarketcap` 从小到大排序这些结果
  const sortedResults = results.sort((a, b) => a.totalmarketcap - b.totalmarketcap);
  // Return sorted results within a table structure
  return (
    <table className="table table-sm">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col" className="form-check form-switch">
              
        <label className="form-check-label" for="SwitchCheck">{isToggled ? 'MERL流通市值/U'  : 'MERL总市值/U'}</label>
        <input className="form-check-input " type="checkbox" role="switch" id="SwitchCheck" checked={isToggled} onChange={handleToggle}></input>

        </th>
        <th scope="col">代币售价/U</th>
        <th scope="col">APY为</th>
        <th scope="col">净利润</th>
        <th scope="col">净利率</th>
      </tr>
    </thead>

    <tbody>
        {sortedResults.map((data, index) => (
          <TableRow
            key={index} // 推荐为每个子元素添加 key 属性
            index={index + 1}
            totalmarketcap={isToggled ? data.totalmarketcap * 0.21  : data.totalmarketcap * 1}
            sell_price={data.sell_price}
            apycal={data.apycal}
            netreward={data.netreward}
            netprofit_={data.netprofit_*100}
          />
        ))}
      </tbody>

  </table>


  );
    };
    
  return (
    <main className="bd-main order-1">
      
      <div className='row justify-content-md-center'>

        <div className='card col-12 position' style={{ minHeight: '100vh'}}>
        <div className="card-header  text-center">
            <div className=' text-muted'>            
            由 <a href="https://twitter.com/0xfaskety" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1458"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z" p-id="1459" fill="#000"></path></svg>
            @0xfaskety</a>  创建
            </div>
            <span className="h3 text-dark">Merlin Seal TVL: {formatNumber(sumdata.data.sum_usd.toFixed(0))} USD</span>
            <p className="h5 text-success">过去24小时新增约: {formatNumber(sumdata.data.changein24.toFixed(0))} USD <svg width="24" height="24" data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"></path>
</svg></p>
          </div>
          <div className='card-body ' >
          <div className="d-flex align-items-start row">
            <div className='col-md-2 col-ms-12' style={{ 'minWidth': "200px"  }}>
            <div className="nav flex-column nav-pills me-3 border border-primary p-2 mb-2 border-opacity-50 rounded" id="v-pills-tab" role="tablist" aria-orientation="vertical" style={{ 'minWidth': "200px"  }}>
              <button className="btn btn-outline-primary active nav-link " id="stakedDetailsaccordion-tab" data-bs-toggle="pill" data-bs-target="#stakedDetailsaccordion" type="button" role="tab" aria-controls="stakedDetailsaccordion" aria-selected="true">Merlin Seal TVL 详细情况</button>
              <button className="nav-link btn btn-outline-primary" id="personalrewardcal-tab" data-bs-toggle="pill" data-bs-target="#personalrewardcal" type="button" role="tab" aria-controls="personalrewardcal" aria-selected="false">个人收益计算器</button>
              <button className="nav-link btn btn-outline-primary" id="merlinActivity-tab" data-bs-toggle="pill" data-bs-target="#merlinActivity" type="button" role="tab" aria-controls="merlinActivity" aria-selected="false">Merlin当前进行活动</button>
              <button className="nav-link btn btn-outline-primary" id="merlinAddress-tab" data-bs-toggle="pill" data-bs-target="#merlinAddress" type="button" role="tab" aria-controls="merlinAddress" aria-selected="false">Merlin相关链接</button>
            </div>
            </div>

            <div className="tab-content col-md-8 col-ms-12" id="v-pills-tabContent">
              <div className="tab-pane fade show active" id="stakedDetailsaccordion" role="tabpanel" aria-labelledby="stakedDetailsaccordion-tab" tabIndex="0">
              <div className='row '>
                <div className="accordion" id="accordionPanelsStayOpenExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="staked-evm-headingOne">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#staked-evm-collapseOne" aria-expanded="false" aria-controls="staked-evm-collapseOne">
                        BTC\ETH\USD 等EVM代币质押详情
                      </button>
                    </h2>
                    <div id="staked-evm-collapseOne" className="accordion-collapse collapse" aria-labelledby="staked-evm-headingOne">
                      <div className="accordion-body row">
                      <CurrencyCard 
                            currencyName="BTC" 
                            staked={btcdata.data.BTC.staked} 
                            priceInTotal={btcdata.data.BTC.staked * btcdata.data.BTC.price} 
                            inputPrice={btcdata.data.BTC.price}

                            isBrc20Token={false}
                            isBrc420Token={false}
                            totaltvl={sumdata.data.sum_usd.toFixed(0)}
                          />
                      {CurrencyevmCards}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="staked-brc20-headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#staked-brc20-collapseTwo" aria-expanded="false" aria-controls="staked-brc20-collapseTwo">
                        Brc20质押详情（按质押率排序）
                      </button>
                    </h2>
                    <div id="staked-brc20-collapseTwo" className="accordion-collapse collapse" aria-labelledby="staked-brc20-headingTwo">
                      <div className="accordion-body row ">
                      {Currency20Cards}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="staked-ordinft-headingThree">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#staked-ordinft-collapseThree" aria-expanded="false" aria-controls="staked-ordinft-collapseThree">
                      ORDI-NFT质押详情（按质押率排序）
                      </button>
                    </h2>
                    <div id="staked-ordinft-collapseThree" className="accordion-collapse collapse"  aria-labelledby="staked-ordinft-headingThree">
                      <div className="accordion-body row ">
                      {CurrencyordiListCards}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="staked-brc420-headingThree">
                      <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#staked-brc420-collapseThree" aria-expanded="true" aria-controls="staked-brc420-collapseThree">
                      Brc420质押详情（按质押率排序）
                      </button>
                    </h2>
                    <div id="staked-brc420-collapseThree" className="accordion-collapse collapse show"  aria-labelledby="staked-brc420-headingThree">
                      <div className="accordion-body row ">
                      {Currency420Cards}
                      </div>
                    </div>
                  </div>
                </div>

                          
                        
                        
                        

                        </div>
              </div>
              <div className="tab-pane fade" id="personalrewardcal" role="tabpanel" aria-labelledby="personalrewardcal-tab" tabIndex="0">
              <div>
                <div className='row' >
                  <div className='col-md-6 col-ms-12' >

                    <div className="form-group row">
                          <div className='row'>
                          <div className='col-md-6 col-ms-6'>
                            <span className='text-dark'>当前积分</span>
                          </div>
                          <div className='col-md-4'>
                          <input
                                      className = "form-control text-end col-4"
                                      type="number"
                                      value={e}
                                      onChange={handleEChange}
                                    />
                          </div>
  
                          </div>
                          <div className='row'>
                          <div className='col-md-6 col-ms-6'><span className='text-dark'>每日可得积分</span></div>
                            <div className='col-md-4'>
                              <input
                                      className = "form-control text-end col-4"
                                      type="number"
                                      value={d}
                                      onChange={handleDChange}
                                    />
                            </div>   
                          </div>
                      <div className='row'>

                        <div className='col-md-6 col-ms-6'>
                          <label htmlFor="dateend " className='text-dark'>假设质押结算时间为</label>
                        </div>
                        <div className='col-md-4'>
                          <input
                        type="date"
                        className="form-control col-4"
                        id="dateend"
                        value={specifiedDate1}
                        min={'2024-03-01'}
                        max={'2024-04-01'}
                        onChange={handlespecifiedDate1Change}
                        
                        />
                        
                      </div>
                      <span className=' col-12 text-muted '>(质押活动于02/08开始)</span>
                        {differencedate !== null && (
                        <p className='col-12 table-info text-dark'>你总计可以质押<span className='h4 strong  text-primary'>{differencedate}</span>  天。</p>
                          )}
                        {differencedate !== null && (
                        <div className='col-12'>  

                                            
                          <div className='row'>
                            <div className='col-12'>
                            <span className='text-dark'>等价于: 从 
                              <input
                              type="date"
                              className="text-end"
                              id="dateInput"
                              value={selectedDate}
                              min={'2024-02-08'}
                              max={'2024-03-24'}
                              onChange={handledateChange}
                              disabled
                            />
                              开始，质押了
                              <input
                                  className = "text-end"
                                  type="number"
                                  value={a}
                                  onChange={handleAChange}
                                />
                                BTC
                            </span>
                              </div>

                                <input
                                className = "text-end"
                                  type="number"
                                  value={b}
                                  onChange={handleBChange}
                                  hidden
                                />

                          </div>
                          <div className='row'>
                          <p className="card-text">
                          <span className='text-dark' >预计将获得</span><span className='h3 strong  text-primary'>{formatNumber(c.toFixed(4))}</span><span className='text-dark'>个MERL代币</span>

                          </p>
                          </div>

                          <div className='row'>


                              {caltable()}

                          
                          </div>
                          
                        </div>
                          
                          
                        )}
                      </div>
                      
                    </div>
                  </div>
                  <div className='col-md-6 col-ms-12 d-flex align-items-center justify-content-center' >
                      <div className='row text-end'>
                        <img src="/pre.png" className='border border-primary rounded shadow-lg p-3 mb-5 bg-body rounded' alt="TVL预测曲线" style={{ maxWidth: '100%', height: 'auto' }}/>
                        <span className='text-muted'>由于BTC价格上涨以及ETHS的质押开启，相较原公式引入了修正项<br></br>
                        截至03-08，目前场外MERL平均成交价为<br></br>
                        3.3 USDT（来自<a href="https://app.whales.market/" target="_blank" rel="noopener noreferrer">whales</a>平台）<br></br>
                        2.9 USDT（来自企鹅OTC群: 383301198）
                        </span>
                      </div>
                      <div className='row'>                     
                      </div>

                    </div>
                </div>

                
              </div>
              </div>
              <div className="tab-pane fade " id="merlinAddress" role="tabpanel" aria-labelledby="merlinAddress-tab" tabIndex="0">
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="address-official-headingOne">
                        <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#address-official-collapseOne" aria-expanded="true" aria-controls="address-official-collapseOne">
                          Merlin 官方链接
                        </button>
                      </h2>
                      <div id="address-official-collapseOne" className="accordion-collapse collapse show" aria-labelledby="address-official-headingOne">
                        <div className="accordion-body row">
                          <table className="table table-sm table-hover text-center">
                              {addressTable(official_addressList)}
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="address-other-headingThree">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#address-other-collapseThree" aria-expanded="true" aria-controls="address-other-collapseThree">
                        其他链接
                        </button>
                      </h2>
                      <div id="address-other-collapseThree" className="accordion-collapse collapse show"  aria-labelledby="address-other-headingThree">
                        <div className="accordion-body row ">
                        <table className="table table-sm table-hover text-center">
                              {addressTable(other_addressList)}
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="otc-other-headingThree">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#otc-other-collapseThree" aria-expanded="true" aria-controls="otc-other-collapseThree">
                        MERL 非官方 场外交易相关
                        </button>
                      </h2>
                      <div id="otc-other-collapseThree" className="accordion-collapse collapse show"  aria-labelledby="otc-other-headingThree">
                        <div className="accordion-body row ">
                        <table className="table table-sm table-hover text-center">
                        <tbody>
                          <tr className='table' key={`table-1`}>
                                <td className='col-4 text-break'><span className='text-black'>whales </span></td>
                                <td className='col-2 text-break'><span className='text-black'>链上场外交易平台</span></td>
                                <td className='col-6 text-break'><a href='https://app.whales.market/' target="_blank" rel="noopener noreferrer">
                                https://app.whales.market/
                                </a></td>
                              </tr>
                              <tr className='table' key={`table-2`}>
                                <td className='col-4 text-break'><span className='text-black'>微博：脱口秀小企鹅    推特:@Goupenguin 场外交易群</span></td>
                                <td className='col-2 text-break'><span className='text-black'>场外交易QQ群</span></td>
                                <td className='col-6 text-break'><span>QQ群号： 383301198 </span></td>
                              </tr>
                        </tbody>
                            
                        </table>
                        </div>
                      </div>
                    </div>
                  </div>
              <div>

              </div>
              </div>
              <div className="tab-pane fade" id="merlinActivity" role="tabpanel" aria-labelledby="merlinActivity-tab" tabIndex="0">
                {MerlinActivity()}
              <div>

              </div>
              </div>
            </div>
          </div>
          </div>
          <div className="card-footer text-muted row">
            <div className='col-12'>如有关于网站的功能、UI或者其他建议或反馈，欢迎在<a href="https://x.com/0xfaskety/status/1757596175874814338?s=20" target="_blank" rel="noopener noreferrer">
              **推文链接**
            </a>本推文下留言~~</div>
            <div className='col-12'>本站开源地址：<a href="https://github.com/yuankongzhe/merlin-static-data-html" target="_blank" rel="noopener noreferrer">
            https://github.com/yuankongzhe/merlin-static-data-html
            </a></div>
            <div className='col-md-8 col-ms-12'>其他Merlin Seal数据网站:
              <a href="https://bitmap.date/merlin/" target="_blank" rel="noopener noreferrer">
              https://bitmap.date/merlin/
            </a>
            </div>
           <div className='col-md-4 col-ms-12'><span className='h6'>更新于：{sumdata.savetime}</span></div>
           <Analytics />
           <SpeedInsights/>
          </div>
        

        </div>
        {/* <div class="toast-container position-fixed bottom-0 end-0 p-3">
          <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <strong class="me-auto">Merlin launchpad 存款现已可以提现</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
            <a href="https://meson.fi/" target="_blank" rel="noopener noreferrer">
            <p>点击前往meson跨链桥提现</p>
            <p>每日跨链桥额度50B，每笔上限0.05B</p>
            </a>
            </div>
          </div>
        </div> */}

      </div>
      
      


    </main>
    
  );
};

export default HomePage;


