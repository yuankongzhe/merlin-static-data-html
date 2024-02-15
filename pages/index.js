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
    <div className='col-md-3 ms-md-auto g-2'>
    <div className='card   h-100 shadow  bg-body rounded'>
        <div className="card-header text-center" style={{ 'background-color': "white"  }}>

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
          percent={(staked / totalSupply * 100).toFixed(0)} 
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
const currency420List = ['Blue Box','Bitmap','This song about NFTs','Mineral']
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
const HomePage = () => {
  const [evmdata, evmsetData] = useState(null);
  const [btcdata, btcsetData] = useState(null);
  const [brc20data, brc20setData] = useState(null);
  const [brc420data, brc420setData] = useState(null);
  const [sumdata, sumsetData] = useState(null);
  const [predicted_tvl_usd, setpredicted_tvl_usd] = useState(null);
  // 设置状态
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0); 
  
  const [selectedDate, setSelectedDate] = useState('');
  const specifiedDate = new Date('2024-04-21'); // 指定日期
  const [differencedate, setdifferencedate] = useState(null);

   
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

  // 使用 useEffect 监听 differencedate 的变化
  useEffect(() => {
    // 确保 differencedate 和 predicted_tvl_usd.data.predicted_tvl_usd 都是有效的值
    if (differencedate != null && predicted_tvl_usd?.data?.predicted_tvl_usd) {
      // 使用最新的 differencedate 值进行计算
      const newC = b * differencedate / predicted_tvl_usd.data.predicted_tvl_usd * 420000000;
      
      // 如果 c 需要更新，使用 setC 更新它
      if (c !== newC) {
        setC(newC);
      }
    }
  }, [differencedate, predicted_tvl_usd, b, c]
  );
  // 如果数据还没加载，显示加载状态
  if (!evmdata) return <div>Loading...</div>;
  if (!btcdata) return <div>Loading...</div>;
  if (!brc20data) return <div>Loading...</div>;
  if (!sumdata) return <div>Loading...</div>;

  const Currency20Cards = currencyList.map((currencyName) => {
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
  const Currency420Cards = currency420List.map((currencyName) => {

    const staked = brc420data.data[currencyName].staked;
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
        totalSupply={brc420data.data[currencyName].totalSupply}
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
    setC(calculatedB *differencedate /predicted_tvl_usd.data.predicted_tvl_usd * 420000000);
  };

  // 当b变化时，更新a和c
  const handleBChange = (event) => {
    const newB = event.target.value;
    setB(newB);
    const calculatedA = newB / btcdata.data.BTC.price;
    setA(calculatedA);
    setC(Number(newB) *differencedate /predicted_tvl_usd.data.predicted_tvl_usd* 420000000);
  };

  const handledateChange = (event) => {
    const inputDate = event.target.value;
    setSelectedDate(inputDate);
    
    // Calculate the difference in days and update the state
    const newDifferenceDate = differenceInCalendarDays(specifiedDate, new Date(inputDate));
    setdifferencedate(newDifferenceDate);
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
            <span className="h3">Merlin Seal TVL: {formatNumber(sumdata.data.sum_usd.toFixed(0))} USD</span>
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
            </div>
            </div>

            <div class="tab-content col-md-8 col-ms-12" id="v-pills-tabContent">
              <div class="tab-pane fade show active" id="stakedDetailsaccordion" role="tabpanel" aria-labelledby="stakedDetailsaccordion-tab" tabindex="0">
              <div className='row '>

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
                          <CurrencyCard 
                          currencyName="ETH" 
                          staked={evmdata.data.ETH.staked} 
                          priceInTotal={evmdata.data.ETH.price_in_usd} 
                          inputPrice={evmdata.data.ETH.price}
                          onPriceChange={handlePriceChange}
                          isBrc20Token={false}
                          isBrc420Token={false}
                          totaltvl={sumdata.data.sum_usd.toFixed(0)}
                        />
                        <CurrencyCard 
                          currencyName="USDT" 
                          staked={evmdata.data.USDT.staked} 
                          priceInTotal={evmdata.data.USDT.price_in_usd} 
                          inputPrice={evmdata.data.USDT.price}
                          onPriceChange={handlePriceChange}
                          isBrc20Token={false}
                          isBrc420Token={false}
                          totaltvl={sumdata.data.sum_usd.toFixed(0)}
                        />
                        <CurrencyCard 
                          currencyName="USDC" 
                          staked={evmdata.data.USDC.staked} 
                          priceInTotal={evmdata.data.USDC.price_in_usd} 
                          inputPrice={evmdata.data.USDC.price}
                          onPriceChange={handlePriceChange}
                          isBrc20Token={false}
                          isBrc420Token={false}
                          totaltvl={sumdata.data.sum_usd.toFixed(0)}
                        />

                        {Currency20Cards}
                        {Currency420Cards}

                        </div>
              </div>
              <div class="tab-pane fade" id="personalrewardcal" role="tabpanel" aria-labelledby="personalrewardcal-tab" tabindex="0">
              <div>
                <div className='row'>
                  <div className='col-md-6 col-ms-12'>

                    <div className="form-group row">
                      <div className='row'>
                        <div className='col-md-6 col-ms-6'>
                          <label htmlFor="dateInput ">开始质押日期</label>
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
                      
                        {differencedate !== null && (
                        <p className='col-12 table-info'>质押结算时间为2024/04/21，你总计可以质押<span className='h4 strong  text-primary'>{differencedate}</span>  天。</p>
                          )}
                        {differencedate !== null && (
                        <div className='col-12'>                          
                          <div className='row'>
                            <div className='col-12'>
                            质押金额为:  
                              </div>
                           <div className='col-12'>
                           <p className="card-text">
                                
                                <input
                                  className = "text-end"
                                  type="number"
                                  value={a}
                                  onChange={handleAChange}
                                />
                                  BTC,
                                  即
                                <input
                                className = "text-end"
                                  type="number"
                                  value={b}
                                  onChange={handleBChange}
                                />
                                  USD
                              </p>
                           </div>
                          </div>
                          <div className='row'>
                          <p className="card-text">
                          预计将获得<span className='h3 strong  text-primary'>{formatNumber(c.toFixed(4))}</span>个MERL代币
                          </p>
                          </div>

                          <div className='row'>
                          <table class="table">
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
                            <tbody>
                              <tr className="table-danger">
                                <th scope="row">1</th>
                                <td>{formatNumber(((b*0.02)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*0.02)/c).toFixed(3))}</td>
                                <td>{formatNumber((2)/45*365)}%</td>
                                <td>{formatNumber((0.02*b).toFixed(0))}</td>
                                <td>2.00%</td>
                              </tr>
                              <tr className="table-warning">
                                <th scope="row">2</th>
                                <td>{formatNumber(((b*0.05)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*0.05)/c).toFixed(3))}</td>
                                <td>{formatNumber((0.05*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((0.05*b).toFixed(0))}</td>
                                <td>{formatNumber((0.0500*100).toFixed(2))}%</td>
                              </tr>
                              <tr className="table-warning">
                                <th scope="row">3</th>
                                <td>{formatNumber(((b*0.1)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*0.1)/c).toFixed(3))}</td>
                                <td>{formatNumber((0.1*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((0.1*b).toFixed(0))}</td>
                                <td>{formatNumber((0.1*100).toFixed(2))}%</td>
                              </tr>
                              <tr className="table-info">
                                <th scope="row">4</th>
                                <td>{formatNumber(((b*0.2)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*0.2)/c).toFixed(3))}</td>
                                <td>{formatNumber((0.2*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((0.2*b).toFixed(0))}</td>
                                <td>{formatNumber((0.2*100).toFixed(2))}%</td>
                              </tr>
                              <tr className="table-info">
                                <th scope="row">5</th>
                                <td>{formatNumber(((b*0.5)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*0.5)/c).toFixed(3))}</td>
                                <td>{formatNumber((0.5*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((0.5*b).toFixed(0))}</td>
                                <td>{formatNumber((0.5*100).toFixed(2))}%</td>
                              </tr>
                              <tr className="table-success">
                                <th scope="row">6</th>
                                <td>{formatNumber(((b*1)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*1)/c).toFixed(3))}</td>
                                <td>{formatNumber((1*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((1*b).toFixed(0))}</td>
                                <td>{formatNumber((1*100).toFixed(2))}%</td>
                              </tr>
                              <tr className="table-success">
                                <th scope="row">7</th>
                                <td>{formatNumber(((b*2)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*2)/c).toFixed(3))}</td>
                                <td>{formatNumber((2*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((2*b).toFixed(0))}</td>
                                <td>{formatNumber((2*100).toFixed(2))}%</td>
                              </tr>
                              <tr className="table-success">
                                <th scope="row">8</th>
                                <td>{formatNumber(((b*5)/c*21).toFixed(2))}亿</td>
                                <td>{formatNumber(((b*5)/c).toFixed(3))}</td>
                                <td>{formatNumber((5*100/0.2).toFixed(2))}%</td>
                                <td>{formatNumber((5*b).toFixed(0))}</td>
                                <td>{formatNumber((5*100).toFixed(2))}%</td>
                              </tr>
                            </tbody>
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


