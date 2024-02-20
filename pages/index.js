// pages/index.js

import { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { differenceInCalendarDays } from 'date-fns';
import CircularProgressBar from '../components/CircularProgressBar';
const CurrencyCard = ({ currencyName, staked, btcPrice, onPriceChange, inputPrice ,isBrc20Token,isBrc420Token,totalSupply,totaltvl}) => {

  const priceInTotal = isBrc20Token ? staked * inputPrice * btcPrice *0.00000001 : isBrc420Token ? staked * inputPrice * btcPrice : staked * inputPrice;
  const unit = isBrc20Token ? ' sats/'+currencyName : isBrc420Token ?  'BTC' : ' /U';

  return (
    <div className='col-md-3  g-2'>
    <div className='card   h-100 shadow  bg-body rounded'>
        <div className="card-header text-center text-dark" style={{ 'background-color': "white"  }}>

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

const currencyList = ['ORDI', 'SATS', 'BTCS', 'RATS', 'MMSS', 'AINN', 'RCSV', 'MICE', 'TRAC'];
const currency420List = ['BLUEBOX','BITMAP','MUSICBOX','MINERAL','DRAGONBALL','BLUEWAND']
const currencyordiList = ['BITCOIN-PUPPETS','BITCOIN-FROGS','NODEMONKES','GOOSINALS']
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
const HomePage = () => {
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
  const [selectedDate, setSelectedDate] = useState('');
  const [specifiedDate1,setspecifiedDate1] = useState('2024-04-01'); // 指定日期
  const [differencedate, setdifferencedate] = useState(null);
  const [control,setcontrol]=useState(null);
   
  // Add state to store input prices
  const [currencyPrices, setCurrencyPrices] = useState(currencyList.reduce((acc, currency) => {
    acc[currency] = 0;
    return acc;
  }, {}));

  // Function to update the currency price and recalculate TVL
  const handlePriceChange = (currencyName, newPrice, staked) => {
    const price = parseFloat(newPrice) || 0;
    setCurrencyPrices({ ...currencyPrices, [currencyName]: price });

    // 需要重新计算其他币种的TVL
    const newSumUSD = currencyList.reduce((sum, cur) => {
      const stakedAmount = cur === 'BTC' ? btcdata.data.BTC.staked : brc20data.data[cur].staked;
      const curPrice = cur === currencyName ? price : currencyPrices[cur];
      const total = cur === 'BTC' ? stakedAmount * curPrice : stakedAmount * curPrice * btcdata.data.BTC.price*0.00000001;
      return sum + total;
    }, evmdata.data.ETH.staked * currencyPrices['ETH'] +
       evmdata.data.USDT.staked * currencyPrices['USDT'] +
       evmdata.data.USDC.staked * currencyPrices['USDC']);

    sumsetData({ ...sumdata, data: { ...sumdata.data, sum_usd: newSumUSD } });
  };
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
  // useEffect(() => {
  //   if (predicted_tvl_usd && predicted_tvl_usd.data) {
  //     // 现在可以安全地访问 predicted_tvl_usd.data
  //     if (selectedDate && specifiedDate1) {
  //       const newDifferenceDate = differenceInCalendarDays(new Date(specifiedDate1), new Date(selectedDate));
  //       setdifferencedate(newDifferenceDate);
        
  //       console.log(b)
  //       console.log(newDifferenceDate)
  //       console.log(predicted_tvl_usd.data.predicted_tvl_usd)
  //       setC((b * newDifferenceDate) / predicted_tvl_usd.data.predicted_tvl_usd * 420000000);

  //     }
  //   }

  // }, [selectedDate,specifiedDate1, control]);
  
  // useEffect 来处理 specifiedDate1 的变化
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
        console.log(b,'usd----')
        console.log(newDifferenceDate,'diff_date')
        console.log(Newsum,'sum')
        console.log(Newsum/newDifferenceDate)
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
  // 使用 useEffect 监听 differencedate 的变化

  // 如果数据还没加载，显示加载状态
  if (!evmdata) return <div>Loading...</div>;
  if (!btcdata) return <div>Loading...</div>;
  if (!brc20data) return <div>Loading...</div>;
  if (!sumdata) return <div>Loading...</div>;
  
  const CurrencyevmCards = Object.keys(evmdata.data).map(currencyName => {
    const staked = evmdata.data[currencyName].staked;
    // console.log(staked);
    const inputPrice = currencyPrices[currencyName] || evmdata.data[currencyName].price;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={evmdata.data[currencyName].price_in_usd}
        inputPrice={inputPrice}
        onPriceChange={handlePriceChange}
        isBrc20Token={false}
        isBrc420Token={false}
        totaltvl={sumdata.data.sum_usd.toFixed(0)}
      />
    );
  });
  const Currency20Cards = currencyList
  .sort((a, b) => {
    const ratioA20 = brc20data.data[a].staked / brc20data.data[a].totalSupply;
    const ratioB20 = brc20data.data[b].staked / brc20data.data[b].totalSupply;
    return ratioB20 - ratioA20  ;
  })
  .map((currencyName) => {
    const staked = brc20data.data[currencyName].staked;
    const inputPrice = currencyPrices[currencyName] || brc20data.data[currencyName].price_sat;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}
        onPriceChange={handlePriceChange}
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
    const inputPrice = currencyPrices[currencyName] || ordidata.data[currencyName].price_btc;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}
        onPriceChange={handlePriceChange}
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
    const inputPrice = currencyPrices[currencyName] || brc420data.data[currencyName].price_btc;
    return (
      <CurrencyCard
        key={currencyName}
        currencyName={currencyName}
        staked={staked}
        btcPrice={btcdata.data.BTC.price}
        priceInTotal={staked * inputPrice * btcdata.data.BTC.price}
        inputPrice={inputPrice}
        onPriceChange={handlePriceChange}
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
    { 'address_info': '其他Merlin看板网站', 'address_link': 'https://bitmap.date/merlin/','color': '',},
    { 'address_info': 'Merlin 跨链桥（Meson）', 'address_link': 'https://meson.fi/','color': '', },
    // ...更多条目...
  ];
  const official_addressList  = [
    // stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_
    { 'address_info': 'Melin 官网', 'address_link': 'https://merlinchain.io/','color': '', },
    { 'address_info': 'Merlin Seal 质押官网', 'address_link': 'https://merlinchain.io/bridge/staking','color': '', },
    
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
          <tr className={`table-${data.color}`}>
            {/* <th scope="row">{index}</th> */}
            <td className='col-4'><span className='text-black'>{data.address_info}</span></td>
            <td className='col-8'><a href={data.address_link} target="_blank" rel="noopener noreferrer">
            {data.address_link}
            </a></td>
          </tr>
        ))}
      </tbody>

  );
    };
  const caltable = () =>{
    const dataList  = [
      // stakednum, gettokennum, totalmarketcap,sell_price,apycal,netreward,netprofit_
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.05},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.10},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.20},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':0.50},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':1.00},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':2.00},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':5.00},
      { 'stakednum': b, 'gettokennum': c, 'netprofit_':10.00},
      { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':10.00},
      { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':20.00},
      { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':50.00},
      { 'stakednum': b, 'gettokennum': c, 'totalmarketcap':100.00},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':0.5},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':1},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':2},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':5},
      { 'stakednum': b, 'gettokennum': c, 'sell_price':10},
      { 'stakednum': b, 'gettokennum': c, 'apycal':0.5},
      { 'stakednum': b, 'gettokennum': c, 'apycal':1.0},
      { 'stakednum': b, 'gettokennum': c, 'apycal':2.0},
      { 'stakednum': b, 'gettokennum': c, 'apycal':5.0},
      { 'stakednum': b, 'gettokennum': c, 'apycal':10},
      // ...更多条目...
    ];

  // 将字典的每个项转换为 `calcother` 函数的参数，并调用函数
  const results = dataList.map(item => calcother(item));

  // 根据 `totalmarketcap` 从小到大排序这些结果
  const sortedResults = results.sort((a, b) => a.totalmarketcap - b.totalmarketcap);
  // Return sorted results within a table structure
  return (

      <tbody>
        {sortedResults.map((data, index) => (
          <TableRow
            key={index} // 推荐为每个子元素添加 key 属性
            index={index + 1}
            totalmarketcap={data.totalmarketcap}
            sell_price={data.sell_price}
            apycal={data.apycal}
            netreward={data.netreward}
            netprofit_={data.netprofit_*100}
          />
        ))}
      </tbody>

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
          <div class="d-flex align-items-start row">
            <div className='col-md-2 col-ms-12'>
            <div class="nav flex-column nav-pills me-3 col-10 border border-primary p-2 mb-2 border-opacity-50 rounded" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <button class="btn btn-outline-primary active nav-link " id="stakedDetailsaccordion-tab" data-bs-toggle="pill" data-bs-target="#stakedDetailsaccordion" type="button" role="tab" aria-controls="stakedDetailsaccordion" aria-selected="true">Merlin Seal TVL 详细情况</button>
              <button class="nav-link btn btn-outline-primary" id="personalrewardcal-tab" data-bs-toggle="pill" data-bs-target="#personalrewardcal" type="button" role="tab" aria-controls="personalrewardcal" aria-selected="false">个人收益计算器</button>
              <button class="nav-link btn btn-outline-primary" id="merlinAddress-tab" data-bs-toggle="pill" data-bs-target="#merlinAddress" type="button" role="tab" aria-controls="merlinAddress" aria-selected="false">Merlin相关链接</button>
            </div>
            </div>

            <div class="tab-content col-md-8 col-ms-12" id="v-pills-tabContent">
              <div class="tab-pane fade show active" id="stakedDetailsaccordion" role="tabpanel" aria-labelledby="stakedDetailsaccordion-tab" tabindex="0">
              <div className='row '>
                <div class="accordion" id="accordionPanelsStayOpenExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="staked-evm-headingOne">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#staked-evm-collapseOne" aria-expanded="false" aria-controls="staked-evm-collapseOne">
                        BTC\ETH\USD 等EVM代币质押详情
                      </button>
                    </h2>
                    <div id="staked-evm-collapseOne" class="accordion-collapse collapse" aria-labelledby="staked-evm-headingOne">
                      <div class="accordion-body row">
                      <CurrencyCard 
                            currencyName="BTC" 
                            staked={btcdata.data.BTC.staked} 
                            priceInTotal={btcdata.data.BTC.staked * btcdata.data.BTC.price} 
                            inputPrice={btcdata.data.BTC.price}
                            onPriceChange={handlePriceChange}
                            isBrc20Token={false}
                            isBrc420Token={false}
                            totaltvl={sumdata.data.sum_usd.toFixed(0)}
                          />
                      {CurrencyevmCards}
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="staked-brc20-headingTwo">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#staked-brc20-collapseTwo" aria-expanded="false" aria-controls="staked-brc20-collapseTwo">
                        Brc20质押详情（按质押率排序）
                      </button>
                    </h2>
                    <div id="staked-brc20-collapseTwo" class="accordion-collapse collapse" aria-labelledby="staked-brc20-headingTwo">
                      <div class="accordion-body row ">
                      {Currency20Cards}
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="staked-ordinft-headingThree">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#staked-ordinft-collapseThree" aria-expanded="false" aria-controls="staked-ordinft-collapseThree">
                      ORDI-NFT质押详情（按质押率排序）
                      </button>
                    </h2>
                    <div id="staked-ordinft-collapseThree" class="accordion-collapse collapse"  aria-labelledby="staked-ordinft-headingThree">
                      <div class="accordion-body row ">
                      {CurrencyordiListCards}
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="staked-brc420-headingThree">
                      <button class="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#staked-brc420-collapseThree" aria-expanded="true" aria-controls="staked-brc420-collapseThree">
                      Brc420质押详情（按质押率排序）
                      </button>
                    </h2>
                    <div id="staked-brc420-collapseThree" class="accordion-collapse collapse show"  aria-labelledby="staked-brc420-headingThree">
                      <div class="accordion-body row ">
                      {Currency420Cards}
                      </div>
                    </div>
                  </div>
                </div>

                          
                        
                        
                        

                        </div>
              </div>
              <div class="tab-pane fade" id="personalrewardcal" role="tabpanel" aria-labelledby="personalrewardcal-tab" tabindex="0">
              <div>
                <div className='row'>
                  <div className='col-md-6 col-ms-12'>

                    <div className="form-group row">
                      <div className='row'>
                        <div className='col-md-6 col-ms-6'>
                          <label htmlFor="dateInput " className='text-dark'>开始质押日期</label>
                        </div>
                        <div className='col-md-4'>
                            <input
                            type="date"
                            className="form-control col-4"
                            id="dateInput"
                            value={selectedDate}
                            min={'2024-02-08'}
                            max={'2024-03-24'}
                            onChange={handledateChange}
                          />

                        </div>
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
                      <span className=' col-12 text-muted '>(质押活动于02/08开始，至03/09持续30天，至03/24持续45天)</span>
                        {differencedate !== null && (
                        <p className='col-12 table-info text-dark'>你总计可以质押<span className='h4 strong  text-primary'>{differencedate}</span>  天。</p>
                          )}
                        {differencedate !== null && (
                        <div className='col-12'>  
                          <div className='row'>
                          <div className='col-12'>
                          <span className='text-dark'>每日可得积分</span><input
                                    className = "text-end col-4"
                                    type="number"
                                    value={d}
                                    onChange={handleDChange}
                                  />
                            </div>      
                          </div>
                                            
                          <div className='row'>
                            <div className='col-12'>
                            <span className='text-dark'>等价质押金额为:  </span>
                              </div>
                           <div className='col-12'>
                           <p className="card-text">
                                
                                <input
                                  className = "text-end"
                                  type="number"
                                  value={a}
                                  onChange={handleAChange}
                                />
                                <span className='text-dark'>  BTC,即</span>
                                <input
                                className = "text-end"
                                  type="number"
                                  value={b}
                                  onChange={handleBChange}
                                />
                                  <span className='text-dark'>USD</span>
                              </p>
                           </div>
                          </div>
                          <div className='row'>
                          <p className="card-text">
                          <span className='text-dark' >预计将获得</span><span className='h3 strong  text-primary'>{formatNumber(c.toFixed(4))}</span><span className='text-dark'>个MERL代币</span>
                          </p>
                          </div>

                          <div className='row'>
                          <table class="table table-sm">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">MERL总市值/U</th>
                                <th scope="col">代币售价/U</th>
                                <th scope="col">APY为</th>
                                <th scope="col">净利润</th>
                                <th scope="col">净利率</th>
                              </tr>
                            </thead>

                              {caltable()}

                          </table>
                          
                          </div>
                          
                        </div>
                          
                          
                        )}
                      </div>
                      
                    </div>
                  </div>
                  <div className='col-md-6 col-ms-12 d-flex align-items-center justify-content-center' >
                      <img src="/pre.png" className='border border-primary rounded shadow-lg p-3 mb-5 bg-body rounded' alt="TVL预测曲线" style={{ maxWidth: '100%', height: 'auto' }}/>
                    </div>
                </div>

                
              </div>
              </div>
              <div class="tab-pane fade" id="merlinAddress" role="tabpanel" aria-labelledby="merlinAddress-tab" tabindex="0">
                <div class="accordion" id="accordionPanelsStayOpenExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="address-official-headingOne">
                        <button class="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#address-official-collapseOne" aria-expanded="true" aria-controls="address-official-collapseOne">
                          Merlin 官方链接
                        </button>
                      </h2>
                      <div id="address-official-collapseOne" class="accordion-collapse collapse show" aria-labelledby="address-official-headingOne">
                        <div class="accordion-body row">
                          <table class="table table-sm table-hover text-center">
                              {addressTable(official_addressList)}
                          </table>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="address-other-headingThree">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#address-other-collapseThree" aria-expanded="true" aria-controls="address-other-collapseThree">
                        其他链接
                        </button>
                      </h2>
                      <div id="address-other-collapseThree" class="accordion-collapse collapse show"  aria-labelledby="address-other-headingThree">
                        <div class="accordion-body row ">
                        <table class="table table-sm table-hover text-center">
                              {addressTable(other_addressList)}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
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

        
      </div>

    </main>
    
  );
};

export default HomePage;


