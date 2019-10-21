<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	exclude-result-prefixes="xsl xs fn n cdocfx dd java-string xr-date-formatter doc">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="CommonFxn.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<xsl:param name="current-locale" as="xs:string" select="'en_US'" />
	
	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>
	
	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>
	
	<xsl:variable name="ResultsPending" as="xs:string">
		<strong>
			<xsl:value-of select="'-- Results Pending --'"/>
		</strong>
	</xsl:variable>
	<xsl:variable name="ContactForPendingResults" as="xs:string" select="'You will be contacted within 72 hours with your results.'"/>
	
	<xsl:variable name="measValueUnit" as="xs:string" select="'%s %s'"/>
	<xsl:variable name="orderDateFormat" as="xs:string" select="'%s (%s)'"/>
	<xsl:variable name="measValueFormat" as="xs:string" select="'%s - %s'"/>
	<xsl:variable name="measValueDateFormat" as="xs:string" select="'%s - %s (%s)'"/>
	
	<xsl:variable name="laboratoryCatalogMeaning" as="xs:string" select="'GENERAL LAB'"/>
	<xsl:variable name="radiologyCatalogMeaning" as="xs:string" select="'RADIOLOGY'"/>
	
	<!-- displayInterfacedResults will be overwritten by the locale specific format. If true, format will display lab measurements that are not tied to non-medication orders. -->
	<xsl:variable name="displayInterfacedResults" as="xs:boolean" select="false()"/>
	
	<!-- displayLabDetails will be overwritten by the locale specific format. If true, format will display the details of lab measurements. -->
	<xsl:variable name="displayLabDetails" as="xs:boolean" select="false()"/>
	
	<!-- displayRadiologyOrders will be overwritten by the locale specific format. If true, format will display radiology orders. -->
	<xsl:variable name="displayRadiologyOrders" as="xs:boolean" select="true()"/>
	
	<!-- displayPendingOrders will be overwritten by the locale specific format. If true, format will display pending laboratory and radiology orders. -->
	<xsl:variable name="displayPendingOrders" as="xs:boolean" select="true()"/>
	
	<!-- Keys -->
	<xsl:key name="labOrdersByOrderId" match="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order" use="@order-id"/>
	<xsl:key name="radExamsByOrderId" match="n:report/n:clinical-data/n:radiology-data/n:radiology-document/n:radiology-exam" use="@order-id"/>
	<xsl:key name="orderCatalogsByCatalogId" match="n:report/n:order-catalog-list/n:order-catalog" use="@order-catalog-id"/>
	
	<!-- This function returns true if eventStatus is not authenticated (AUTH/ALTERED/MODIFIED) and not in error (INERROR/INERRONOMUT/INERRORNOVIEW), false otherwise.-->
	<!-- Parameters: -->
	<!-- eventStatus - The event status code to check against. -->
	<xsl:function name="cdocfx:isPendingResult" as="xs:boolean">
		<xsl:param name="eventStatus" as="xs:string"/>
		
		<xsl:choose>
			<xsl:when test="not(cdocfx:isStatusCodeAuthenticated($eventStatus)) and not(cdocfx:isStatusCodeInError($eventStatus))">
				<xsl:value-of select="fn:true()"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This template is used to create a temporary structure with all of the information needed for displaying pending and authenticated laboratory and radiology orders
		as well as for displaying orders that are not tied to lab measurements or rad exams. -->
	<xsl:template match="n:report/n:clinical-data/n:order-data/n:non-medication-order" mode="preprocessing">
		<xsl:variable name="labOrder" select="key('labOrdersByOrderId', @order-id, $root-node)"/>
		<xsl:variable name="radExam" select="key('radExamsByOrderId', @order-id, $root-node)"/>
		
		<xsl:variable name="orderStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@order-status-code)"/>
		<!-- This is used to determine if a lab order which is not associated to any lab measurement or rad exam should be displayed. -->
		<xsl:variable name="departmentStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@department-status-code)"/>

		<xsl:choose>
			<!-- Process the non-medication order that is not associated to any lab measurement or rad exam and has order status of ORDERED and
				department status of LABDISPATCH or LABSCHEDULED or LABCOLLECTED or LABINLAB or LABINTRANSIT or LABINPROCESS or LABPRELIMINARY if it's a laboratory order. -->
			<xsl:when test="$orderStatusMean = 'ORDERED' and not($radExam) and not($labOrder)">
				<xsl:variable name="orderCatalog" select="key('orderCatalogsByCatalogId', n:order-synonym/@order-catalog-id, $root-node)"/>
				
				<xsl:if test="$orderCatalog">
					<xsl:variable name="orderCatalogMean" as="xs:string" select="cdocfx:getCodeMeanByID($orderCatalog/@catalog-type-code)"/>
					
					<order>
						<!-- sort attributes -->
						<!-- synonym-id is used to identify instances of the same order. -->
						<xsl:attribute name="sortId" select="n:order-synonym/@synonym-id"/>
						<xsl:attribute name="sortDate" select="n:order-schedule/n:start-dt-tm"/>
						
						<xsl:choose>
							<!-- If this a lab order then only display it if the department status is LABDISPATCH or LABSCHEDULED or LABCOLLECTED or LABINLAB or LABINTRANSIT or LABINPROCESS or LABPRELIMINARY. -->
							<xsl:when test="$orderCatalogMean = $laboratoryCatalogMeaning and ($departmentStatusMean = 'LABDISPATCH' or $departmentStatusMean = 'LABSCHEDULED' or $departmentStatusMean = 'LABCOLLECTED' or $departmentStatusMean = 'LABINLAB' or $departmentStatusMean = 'LABINTRANSIT' or $departmentStatusMean = 'LABINPROCESS' or $departmentStatusMean = 'LABPRELIMINARY')">
								<result>
									<xsl:attribute name="id" select="@order-id"/>
									<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
									<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
									<xsl:attribute name="isPending" select="true()"/>
									<xsl:attribute name="orderCatalogMeaning" select="$orderCatalogMean"/>
								</result>
							</xsl:when>
							<xsl:when test="$displayRadiologyOrders = true() and $orderCatalogMean = $radiologyCatalogMeaning">
								<result>
									<xsl:attribute name="id" select="@order-id"/>
									<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
									<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
									<xsl:attribute name="isPending" select="true()"/>
									<xsl:attribute name="orderCatalogMeaning" select="$orderCatalogMean"/>
								</result>
							</xsl:when>
						</xsl:choose>
					</order>
				</xsl:if>
			</xsl:when>
			<!-- Process the non-medication order associated to a laboratory measurement.
				 The order will only be displayed once even if the lab has multiple measurements. -->
			<xsl:when test="$labOrder">
				<!-- Find any measurement for a lab order that was charted within dateTimeThreshold. -->				
				<xsl:variable name="pendingResults" select="$labOrder/n:specimen-collection/n:measurement[cdocfx:isPendingResult(cdocfx:getCodeMeanByID(@event-status-code))]"/>
				
				<!-- Sort specimen collections tied to current lab order in descending order of collected-dt-tm. This helps to determine the most recently collected lab order. -->
				<xsl:variable name="sortedLabResults">
					<xsl:for-each select="$labOrder/n:specimen-collection">
						<xsl:sort select="n:collected-dt-tm" order="descending"/>
						
						<xsl:copy-of select="."/>
					</xsl:for-each>
				</xsl:variable>
				
				<order>
					<!-- sort attributes -->
					<!-- synonym-id is used to identify instances of the same order. -->
					<xsl:attribute name="sortId" select="n:order-synonym/@synonym-id"/>
					<!-- Since specimen collections are sorted based on collected-dt-tm, the first collection will be the most recent one. Therefore use that collection's
						collected-dt-tm for sorting the combined list of results, orders and exams. -->
					<xsl:attribute name="sortDate" select="$sortedLabResults/n:specimen-collection[1]/n:collected-dt-tm"/>
					
					<xsl:choose>
						<!-- Build pending result. -->
						<xsl:when test="fn:count($pendingResults) > 0">
							<result>
								<xsl:attribute name="id" select="@order-id"/>
								<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
								<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
								<xsl:attribute name="isPending" select="true()"/>
								<xsl:attribute name="orderCatalogMeaning" select="$laboratoryCatalogMeaning"/>
							</result>
						</xsl:when>
						<!-- Build authenticated results. -->
						<xsl:otherwise>
							<xsl:variable name="orderId" as="xs:string" select="@order-id"/>
							<xsl:variable name="orderDisplay" as="xs:string" select="cdocfx:getOrderDisplay(.)"/>
							
							<xsl:for-each select="$sortedLabResults/n:specimen-collection">
								<!-- Build a result for each specimen collection if displayLabDetails is true (which means we are displaying Test Results). This helps in displaying the order once
								for each collection in case there are multiple specimen collections.
								If displayLabDetails is false (which means we are displaying Tests Performed) then build only a single result for this lab-order, since we display the order only
								once in Tests Performed section, irrespective of the number of specimen collections. <result> will be built for only the first specimen-collection under the lab-order. -->
								<xsl:if test="($displayLabDetails = true() or position() = 1) and n:measurement[cdocfx:isStatusCodeAuthenticated(cdocfx:getCodeMeanByID(@event-status-code))]">
									<result>
										<xsl:attribute name="id" select="$orderId"/>
										<xsl:attribute name="display" select="$orderDisplay"/>
										<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
										<xsl:attribute name="isPending" select="false()"/>
										<xsl:attribute name="orderCatalogMeaning" select="$laboratoryCatalogMeaning"/>
										
										<xsl:if test="$displayLabDetails = true()">
											<xsl:attribute name="resultDate" select="cdocfx:getFormattedDateTime(n:collected-dt-tm, $DATE_ONLY_SEQUENCE)"/>
											
											<xsl:for-each select="n:measurement">
												<xsl:sort select="doc:getSequence(n:event-type/@event-code-id)" data-type="number" order="ascending"/>
												
												<!-- Construct details only if the measurement is authenticated. -->
												<xsl:if test="cdocfx:isStatusCodeAuthenticated(cdocfx:getCodeMeanByID(@event-status-code))">
													<detail>
														<xsl:attribute name="name" select="n:event-type/@event-display"/>
														<xsl:attribute name="value" select="cdocfx:getMeasurementValue(.,$DATE_SEQUENCE,$DATE_ONLY_SEQUENCE,$measValueUnit)"/>
													</detail>
												</xsl:if>
											</xsl:for-each>
										</xsl:if>
									</result>
								</xsl:if>
							</xsl:for-each>
						</xsl:otherwise>
					</xsl:choose>
				</order>
			</xsl:when>
			<!-- Process the non-medication order associated to a radiology exam. -->
			<xsl:when test="$radExam and $displayRadiologyOrders = true()">
				<!-- Build the order only if the exam is not In Error. -->
				<xsl:if test="not(cdocfx:isStatusCodeInError(cdocfx:getCodeMeanByID($radExam/@event-status-code)))">
					<order>
						<!-- sort attributes -->
						<!-- synonym-id is used to identify instances of the same order. -->
						<xsl:attribute name="sortId" select="n:order-synonym/@synonym-id"/>
						<xsl:attribute name="sortDate" select="$radExam/n:event-end-dt-tm"/>
						
						<result>
							<xsl:attribute name="id" select="@order-id"/>
							<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
							<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
							<xsl:attribute name="orderCatalogMeaning" select="$radiologyCatalogMeaning"/>
							<xsl:choose>
								<xsl:when test="cdocfx:isPendingResult(cdocfx:getCodeMeanByID($radExam/@event-status-code))">
									<xsl:attribute name="isPending" select="true()"/>
								</xsl:when>
								<xsl:when test="cdocfx:isStatusCodeAuthenticated(cdocfx:getCodeMeanByID($radExam/@event-status-code))">
									<xsl:attribute name="isPending" select="false()"/>
								</xsl:when>
							</xsl:choose>
						</result>
					</order>
				</xsl:if>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
	<!-- This template is used to create a temorary structure for lab measurements which are not tied to any non-medication order. -->
	<xsl:template match="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order" mode="preprocessing">
		
		<!-- Display lab measurements that are not tied an order. -->
		<xsl:if test="not(@order-id)">
			
			<!-- Sort specimen collections tied to current lab order in descending order of collected-dt-tm. This helps to determine the most recently collected lab order. -->
			<xsl:variable name="sortedLabResults">
				<xsl:for-each select="n:specimen-collection">
					<xsl:sort select="n:collected-dt-tm" order="descending"/>
					
					<xsl:copy-of select="."/>
				</xsl:for-each>
			</xsl:variable>
			
			<xsl:for-each select="$sortedLabResults/n:specimen-collection">
				<xsl:for-each select="n:measurement">
					<xsl:variable name="eventStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@event-status-code)" />
					
					<!-- Build the order only if the measurement is not In Error. -->
					<xsl:if test="not(cdocfx:isStatusCodeInError($eventStatusMean))">
						<order>
							<!-- sort attributes -->
							<!-- event-code-id is used to identify instances of the same measurement. -->
							<xsl:attribute name="sortId" select="n:event-type/@event-code-id"/>
							<xsl:attribute name="sortDate" select="../n:collected-dt-tm"/>
							
							<result>
								<xsl:attribute name="id" select="@event-id"/>
								<xsl:attribute name="display" select="n:event-type/@event-display"/>
								<xsl:attribute name="contentType" select="'LABS_V2'"/>
								<xsl:attribute name="orderCatalogMeaning" select="''"/>
								
								<xsl:choose>
									<xsl:when test="cdocfx:isPendingResult($eventStatusMean)">
										<xsl:attribute name="isPending" select="true()"/>
									</xsl:when>
									<xsl:when test="cdocfx:isStatusCodeAuthenticated($eventStatusMean)">
										<xsl:attribute name="isPending" select="false()"/>
										
										<!-- Construct details only if the measurement is authenticated and displayLabDetails is true. -->
										<xsl:if test="$displayLabDetails = true()">
											<xsl:attribute name="resultDate" select="cdocfx:getFormattedDateTime(../n:collected-dt-tm, $DATE_ONLY_SEQUENCE)"/>
											
											<detail>
												<xsl:attribute name="value" select="cdocfx:getMeasurementValue(.,$DATE_SEQUENCE,$DATE_ONLY_SEQUENCE,$measValueUnit)"/>
											</detail>
										</xsl:if>
									</xsl:when>
								</xsl:choose>
							</result>
						</order>
					</xsl:if>
				</xsl:for-each>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	
	<!-- This template can be used to display results when only the name of the order is to be displayed (For ex., it can be used to display all results in Tests Peformed section,
	and/or it can be used to display pending results in Test Results section). -->
	<xsl:template name="displayResultWithoutDetails">
		<xsl:param name="result" as="element()?"/>
		
		<div class="ddemrcontentitem ddremovable" style="margin-bottom: 5px;">
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$result/@id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:value-of select="$result/@contentType" />
			</xsl:attribute>
			<xsl:value-of select="$result/@display"/>
			<xsl:if test="$result/@isPending = true()">
				<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]><![CDATA[&#160;]]><![CDATA[&#160;]]></xsl:text>
				<strong>
					<xsl:value-of select="$ResultsPending"/>
				</strong>
			</xsl:if>
		</div>
	</xsl:template>
	
	<!-- main template -->
	<xsl:template match="/">
		<xsl:variable name="performedOrders">
			<!-- This template handles non-med orders which are not tied to any results as well as all lab measurements and rad exams which are associated to an order. -->
			<xsl:if test="n:report/n:clinical-data/n:order-data/n:non-medication-order">
				<xsl:apply-templates select="n:report/n:clinical-data/n:order-data/n:non-medication-order" mode="preprocessing"/>
			</xsl:if>
			<!-- This template handles all lab measurements which are not associated to any order. -->
			<xsl:if test="$displayInterfacedResults = true() and n:report/n:clinical-data/n:lab-measurement-data/n:lab-order">
				<xsl:apply-templates select="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order" mode="preprocessing"/>
			</xsl:if>
			<!-- We don't need a separate template (similar to lab template above) to handle rad exams which are not tied to any order, since rad exams will always be
				tied to some order and will get processed in the non-med order template above. -->
		</xsl:variable>
		
		<!-- Group all the results for repeated orders together and sort them from most recent to the least recent. -->
		<xsl:variable name="sortedOrders">
			<xsl:for-each select="$performedOrders/order">
				<xsl:sort select="@sortId" order="ascending"/>
				<xsl:sort select="@sortDate" order="descending"/>
				
				<xsl:copy-of select="."/>
			</xsl:for-each>
		</xsl:variable>
		
		<!-- Retain the most recent result for an order and filter out all other results for that order. -->
		<xsl:variable name="filteredOrders">
			<xsl:for-each select="$sortedOrders/order">
				
				<xsl:if test="position() = 1 or not(@sortId = preceding-sibling::order[1]/@sortId)">
					<xsl:copy-of select="."/>
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>
		
		<xsl:choose>
			<!-- Display Test Results section. -->
			<xsl:when test="$displayLabDetails = true()">
				<xsl:for-each select="$filteredOrders/order">
					<!-- Sort all the pending results based on meaning and sub sort on alphabetical order of display. -->
					<xsl:sort select="upper-case(result[1]/@orderCatalogMeaning)" data-type="text" order="ascending"/>
					<xsl:sort select="lower-case(result[1]/@display)" data-type="text" order="ascending"/>
					
					<xsl:for-each select="result">
						<xsl:choose>
							<xsl:when test="@isPending = true()">
								<xsl:if test="$displayPendingOrders = true()">
									<xsl:call-template name="displayResultWithoutDetails">
										<xsl:with-param name="result" select="."/>
									</xsl:call-template>
								</xsl:if>
							</xsl:when>
							<xsl:otherwise>
								<div class="ddemrcontentitem ddremovable" style="margin-bottom: 5px;">
									<xsl:attribute name="dd:entityid">
										<xsl:value-of select="@id"/>
									</xsl:attribute>
									<xsl:attribute name="dd:contenttype">
										<xsl:value-of select="@contentType" />
									</xsl:attribute>
									
									<xsl:choose>
										<!-- Display authenticated lab measurements tied to a non-med order. -->
										<xsl:when test="detail[@name]">
											<xsl:variable name="orderDisplay" as="xs:string" select="@display"/>
											<xsl:variable name="collectedDate" as="xs:string" select="@resultDate"/>
											
											<xsl:value-of select="java-string:format($orderDateFormat, ($orderDisplay, $collectedDate))"/>
											
											<ul style="margin: 5px 0 0 0; padding-left: 20px; list-style-type: none;">
												<xsl:for-each select="detail">
													<xsl:variable name="resultName" as="xs:string" select="@name"/>
													<xsl:variable name="resultValue" as="xs:string" select="@value"/>
													
													<li>
														<xsl:value-of select="java-string:format($measValueFormat, ($resultName, $resultValue))"/>
													</li>
												</xsl:for-each>
											</ul>
										</xsl:when>
										<!-- Display authenticated lab measurements that are not tied to any non-med order. -->
										<xsl:when test="detail">
											<xsl:variable name="resultName" as="xs:string" select="@display"/>
											<xsl:variable name="resultValue" as="xs:string" select="detail[1]/@value"/>
											<xsl:variable name="collectedDate" as="xs:string" select="@resultDate"/>
											
											<xsl:value-of select="java-string:format($measValueDateFormat, ($resultName, $resultValue, $collectedDate))"/>
										</xsl:when>
										<!-- Display authenticated rad exams. We make sure during preprocessing that rad exams will only be built if $displayRadiologyOrders is true.
										For Test Results section, $displayRadiologyOrders is false by default so we will never reach this point and rad exams will not be displayed
										(we don't need to again check the value of $displayRadiologyOrders here since we have already taken care of that during preprocessing).-->
										<xsl:otherwise>
											<xsl:value-of select="@display"/>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:when>
			<!-- Display Tests Performed section. -->
			<xsl:otherwise>
				<xsl:for-each select="$filteredOrders/order">
					<!-- Sort all the results based on meaning and sub sort on alphabetical order of display. -->
					<xsl:sort select="upper-case(result/@orderCatalogMeaning)" data-type="text" order="ascending"/>
					<xsl:sort select="lower-case(result/@display)" data-type="text" order="ascending"/>
					
					<xsl:choose>
						<!-- Display pending results only if $displayPendingOrders flag is set to true. -->
						<xsl:when test="result/@isPending = true()">
							<xsl:if test="$displayPendingOrders = true()">
								<xsl:call-template name="displayResultWithoutDetails">
									<xsl:with-param name="result" select="result"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:when>
						<!-- Check if the result exists. It will not exist for lab-orders that are tied to non-medication orders and all the measurements are In Error.
						In that case we don't want to display an empty row. -->
						<xsl:when test="result">
							<xsl:call-template name="displayResultWithoutDetails">
								<xsl:with-param name="result" select="result"/>
							</xsl:call-template>
						</xsl:when>
					</xsl:choose>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
		
		<!-- Display the meassage for contacting for pending results only if there is at least one pending result and $displayPendingOrders is true. -->
		<xsl:if test="$filteredOrders/order/result[@isPending = true()] and $displayPendingOrders = true()">
			<div style="margin-top: 20px;">
				<xsl:value-of select="$ContactForPendingResults"/>
			</div>
		</xsl:if>
	</xsl:template>
	
</xsl:stylesheet>