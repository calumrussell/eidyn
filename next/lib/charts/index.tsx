"use client"
import { useEffect, useRef } from "react";
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { map, max } from 'd3-array';

interface OpeningsEloChangeBarChartProps {
  chartData: Array<{
    name: string,
    value: number,
  }>
}

const OpeningsEloChangeBarChart = ({ chartData }: OpeningsEloChangeBarChartProps) => {

  const ref = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 400;
    const margin = {
      left: 50,
      right: 10,
      top: 10,
      bottom: 10,
    };
    
    const svg = select(ref.current)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const groups = map(chartData, (d) => d.name);

    var x = scaleBand()
      .domain(groups)
      .range([0, width])
      .padding(0.2)

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x).tickSize(0));

    const max_temp = Math.max(...chartData.map(d => d['value']));
    const min_temp = Math.min(...chartData.map(d => d['value']));

    const max = max_temp * 1.25;
    const min = min_temp > 0 ? min_temp * 0.75 : min_temp * 1.25;
    
    var y = scaleLinear()
      .domain([min, max])
      .range([ height, 0 ]);

    svg.append("g")
      .call(axisLeft(y));

    svg.append("g")
      .selectAll("g")
      .data(chartData)
      .enter()
      .append("rect")
        .attr("x", d => {
          //Doing this because of weird type error bug
          let val = x(d['name']);
          if (val != undefined) {
            return val;
          }
          //Should never trigger
          return 0;
        })
        .attr("y", d => y(d['value']))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d['value']))
        .attr("fill", "#69b3a2")
  }, [chartData])

  return (
    <div ref={ref} />
  )
}

export default OpeningsEloChangeBarChart;