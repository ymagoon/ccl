<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:java-string="java:java.lang.String"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment out this line to debug -->	<xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
	<!-- Uncomment this line to debug  <xsl:include href="CommonFxn.xslt"/> -->

	<xsl:variable name="WeekOf" as="xs:string">
		<xsl:value-of select="'Week of %s'"/>
	</xsl:variable>

	<!-- Procedure display format with service date: "[loose-name-display] ([service date])" -->
	<xsl:variable name="DisplayWithServiceDt" as="xs:string">
		<xsl:value-of select="'%s (%s)'"/>
	</xsl:variable>

	
	<!-- Default string constants -->
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
	<xsl:variable name="MONTH_YEAR_SEQUENCE" as="xs:string" select="'MM/yyyy'"/>

	<!-- Keys -->
	<xsl:key match="n:report/n:charge-data/n:charge" name="charges" use="@charge-id"/>
	<xsl:key match="n:report/n:clinical-data/n:order-data/n:medication-order" name="medicationOrders" use="@order-id"/>
	<xsl:key match="n:report/n:clinical-data/n:order-data/n:non-medication-order" name="nonMedicationOrders" use="@order-id"/>

	<!-- This template is used to create a temporary structure with all of the information needed for the display. -->
	<xsl:template match="n:report/n:clinical-data/n:procedure-data/n:clinical-procedure" mode="preprocessing">
		<procedure>
			<xsl:variable name="sServiceDate">
				<xsl:choose>
					<xsl:when test="n:service-dt-tm/n:date">
						<xsl:value-of select="cdocfx:get-procedure-sequence(n:service-dt-tm)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<xsl:attribute name="id" select="@id"/>
			<xsl:attribute name="description" select="cdocfx:get-loose-name-display(n:description)"/>
			<xsl:attribute name="display" select="cdocfx:getProcedureDisplay(., $sServiceDate)"/>
			<xsl:attribute name="type" select="'CLINICAL_PROCEDURE'"/>

			<!-- Add an attribute with the sort order (a date in the format yyyy-mm-dd) only if the procedure has a service date. -->
			<xsl:if test="n:service-dt-tm and n:service-dt-tm/n:date" >
				<xsl:variable name="PR_YEAR_ONLY_SEQUENCE" as="xs:string" select="'yyyy'"/>
				<xsl:variable name="PR_MONTH_ONLY_SEQUENCE" as="xs:string" select="'MM'"/>
				<xsl:variable name="PR_DAY_ONLY_SEQUENCE" as="xs:string" select="'dd'"/>

				<xsl:variable name="timezone" select="n:service-dt-tm/n:date/@time-zone"/>
				<xsl:variable name="date_time" as="xs:dateTime" select="n:service-dt-tm/n:date"/>
				<xsl:variable name="precision" select="n:service-dt-tm/@precision-type"/>

				<xsl:variable name="sYear" as="xs:string">
					<xsl:value-of select="xr-date-formatter:formatDate($date_time, $PR_YEAR_ONLY_SEQUENCE, $timezone, $current-locale)"/>
				</xsl:variable>

				<xsl:variable name="sMonth" as="xs:string">
					<xsl:choose>
						<xsl:when test="$precision = 'DATE_AND_TIME' or $precision = 'WEEK' or $precision = 'MONTH'">
							<xsl:value-of select="xr-date-formatter:formatDate($date_time, $PR_MONTH_ONLY_SEQUENCE, $timezone, $current-locale)"/>
						</xsl:when>

						<xsl:otherwise>
							<!-- If no month, use January since it is farther away than December in a descending sort -->
							<xsl:value-of select="'01'" />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>

				<xsl:variable name="sDay" as="xs:string">
					<xsl:choose>
						<xsl:when test="$precision = 'DATE_AND_TIME' or $precision = 'WEEK'">
							<xsl:value-of select="xr-date-formatter:formatDate($date_time, $PR_DAY_ONLY_SEQUENCE, $timezone, $current-locale)"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- If no day, use the first of the month since it is the older date in a descending sort -->
							<xsl:value-of select="'01'" />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>

				<!-- We really don't care about timezones since we don't have hour precision anyway so always use -5 (CST) -->
				<!-- NOTE: This does NOT need to be declared above where it can be internationalized because we want it to be the same for every language -->
				<xsl:variable name="DateFormat" as="xs:string" select="'%s-%s-%sT00:00:00.000-05:00'"/>
				<xsl:attribute name="sortOrder" select="java-string:format($DateFormat, ($sYear, $sMonth, $sDay))"/>
			</xsl:if>
		</procedure>
	</xsl:template>
	
	<!-- This template is used to create a temporary structure with all of the information needed for the display of procedure orders. -->
	<xsl:template match="n:report/n:clinical-data/n:procedure-order-data/n:procedure-order" mode="preprocessing">
		<xsl:variable name="charge_element" select="key('charges', @charge-id, $root-node)"/>
		<!--If a charge node not associated with an attribute order-id, that charge node is ignored intentionally. -->
		<xsl:if test="$charge_element/@order-id and $charge_element/@charge-id">
			<procedure>
				<xsl:variable name="serviceDate">
					<xsl:choose>
						<xsl:when test="$charge_element/n:service-dt-tm">
							<xsl:variable name="serviceDateTime" as="xs:dateTime" select="$charge_element/n:service-dt-tm"/>
							<xsl:variable name="timeZone" as="xs:string" select="$charge_element/n:service-dt-tm/@time-zone"/>
							<xsl:value-of select="xr-date-formatter:formatDate($serviceDateTime, $DATE_ONLY_SEQUENCE, $timeZone, $current-locale)"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="''"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
			
				<xsl:attribute name="id" select="$charge_element/@order-id"/>
				<xsl:attribute name="description" select="cdocfx:getOrderedProcedureDescription($charge_element/@order-id)"/>
				<xsl:attribute name="display" select="cdocfx:getOrderedProcedureDisplay($charge_element, $serviceDate)"/>
				<xsl:attribute name="type" select="'ORDERED_PROCEDURE'"/>
				
				<xsl:if test="$charge_element/n:service-dt-tm">
					<xsl:variable name="serviceDate" as="xs:dateTime" select="$charge_element/n:service-dt-tm"/>
					<xsl:variable name="timezone" select="$charge_element/n:service-dt-tm/@time-zone"/>
				
					<xsl:variable name="PR_YEAR_ONLY_SEQUENCE" as="xs:string" select="'yyyy'"/>
					<xsl:variable name="PR_MONTH_ONLY_SEQUENCE" as="xs:string" select="'MM'"/>
					<xsl:variable name="PR_DAY_ONLY_SEQUENCE" as="xs:string" select="'dd'"/>
				
					<xsl:variable name="sYear" as="xs:string">
						<xsl:value-of select="xr-date-formatter:formatDate($serviceDate, $PR_YEAR_ONLY_SEQUENCE, $timezone, $current-locale)"/>
					</xsl:variable>
				
					<xsl:variable name="sMonth" as="xs:string">
						<xsl:value-of select="xr-date-formatter:formatDate($serviceDate, $PR_MONTH_ONLY_SEQUENCE, $timezone, $current-locale)"/>
					</xsl:variable>
				
					<xsl:variable name="sDay" as="xs:string">
						<xsl:value-of select="xr-date-formatter:formatDate($serviceDate, $PR_DAY_ONLY_SEQUENCE, $timezone, $current-locale)"/>
					</xsl:variable>
				
					<!-- We really don't care about timezones since we don't have hour precision anyway so always use -5 (CST) -->
					<!-- NOTE: This does NOT need to be declared above where it can be internationalized because we want it to be the same for every language -->
					<xsl:variable name="DateFormat" as="xs:string" select="'%s-%s-%sT00:00:00.000-05:00'"/>
					<xsl:attribute name="sortOrder" select="java-string:format($DateFormat, ($sYear, $sMonth, $sDay))"/>
				</xsl:if>
			</procedure>
		</xsl:if> 
	</xsl:template>


	<!-- Functions -->
	<!-- Format display text from given clinical-procedure node -->
	<!-- Parameters: -->
	<!-- 	procedure - the clinical-procedure node -->
	<!-- 	sServiceDate - the service-dt-tm string that has been adjusted to display the correct accuracy -->
	<xsl:function name="cdocfx:getProcedureDisplay" as="xs:string">
		<xsl:param name="procedure" as="element()?"/>
		<xsl:param name="sServiceDate" as="xs:string"/>
		
		<!-- If the procedure has an annotated description then use it to populate the display otherwise fallback to nomenclature display. -->
		<xsl:variable name="display" as="xs:string">
			<xsl:choose>
				<xsl:when test="$procedure/n:service-dt-tm/n:date">
					<xsl:variable name="description" as="xs:string">
						<xsl:choose>
							<xsl:when test="$procedure/@annotated-description and string-length($procedure/@annotated-description) &gt; 0">
								<xsl:value-of select="$procedure/@annotated-description"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="cdocfx:get-loose-name-display($procedure/n:description)"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<!--  In case date is to be displayed then uncomment else comment next line -->
					<xsl:value-of select="java-string:format($DisplayWithServiceDt, ($description, $sServiceDate))"/>
					<!-- In case date is not to be displayed then uncomment  -->
					<!--  <xsl:value-of select="$description"/>  -->
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="$procedure/@annotated-description and string-length($procedure/@annotated-description) &gt; 0">
							<xsl:value-of select="$procedure/@annotated-description"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="cdocfx:get-loose-name-display($procedure/n:description)"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$display"/>
	</xsl:function>
	
	<!-- Format display text for the procedure order using order id from the given charge node. -->
	<!-- Parameters: -->
	<!-- 	charge - The charge node used to look up the order for the procedure display. -->
	<!-- 	serviceDate - The service-dt-tm string in mm/dd/yyyy format. -->
	<xsl:function name="cdocfx:getOrderedProcedureDisplay" as="xs:string">
		<xsl:param name="charge" as="element()?"/>
		<xsl:param name="serviceDate" as="xs:string"/>
		
		<xsl:variable name="order_id" select="$charge/@order-id"/>
		<xsl:variable name="nonMedicationOrder" select="key('nonMedicationOrders', $order_id, $root-node)"/>
		<xsl:variable name="medicationOrder" select="key('medicationOrders', $order_id, $root-node)"/>
			
		<xsl:variable name="display" as="xs:string">
			<xsl:choose>
				<xsl:when test="$nonMedicationOrder">
					<xsl:variable name="procedure_name" as="xs:string">
						<xsl:value-of select="cdocfx:getOrderDisplay($nonMedicationOrder)"/>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="$charge/n:service-dt-tm">
							<xsl:value-of select="java-string:format($DisplayWithServiceDt, ($procedure_name, $serviceDate))"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$procedure_name"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="$medicationOrder">
					<xsl:variable name="procedure_name" as="xs:string">
						<xsl:value-of select="cdocfx:getOrderDisplay($medicationOrder)"/>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="$charge/n:service-dt-tm">
							<xsl:value-of select="java-string:format($DisplayWithServiceDt, ($procedure_name, $serviceDate))"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$procedure_name"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$display"/>
	</xsl:function>
	
	<!-- Format description text for the procedure order using order id from the given charge node. -->
	<!-- Parameters: -->
	<!-- 	order_id - The id of the order used to populate the procedure description. -->
	<xsl:function name="cdocfx:getOrderedProcedureDescription" as="xs:string">
		<xsl:param name="order_id" as="xs:string"/>
		
		<xsl:variable name="nonMedicationOrder" select="key('nonMedicationOrders', $order_id, $root-node)"/>
		<xsl:variable name="medicationOrder" select="key('medicationOrders', $order_id, $root-node)"/>
		
		<xsl:choose>
			<xsl:when test="$nonMedicationOrder">
				<xsl:value-of select="cdocfx:getOrderDisplay($nonMedicationOrder)"/>
			</xsl:when>
			<xsl:when test="$medicationOrder">
				<xsl:value-of select="cdocfx:getOrderDisplay($medicationOrder)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This function is used to format the date for the given precision.-->
	<!-- Parameters: -->
	<!-- 	service-dt-tm - the service-dt-tm that needs to be adjusted for accuracy (NOTE: It includes the accuracy) -->
	<xsl:function name="cdocfx:get-procedure-sequence" as="xs:string">
		<xsl:param name="service-dt-tm" as="element()?"/>

		<xsl:variable name="PR_YEAR_SEQUENCE" as="xs:string" select="'yyyy'"/>

		<xsl:variable name="precision">
			<xsl:value-of select="$service-dt-tm/@precision-type"/>
		</xsl:variable>
		<xsl:variable name="timezone">
			<xsl:value-of select="$service-dt-tm/n:date/@time-zone"/>
		</xsl:variable>
		<xsl:variable name="date_time" as="xs:dateTime" select="$service-dt-tm/n:date"/>

		<xsl:choose>
			<xsl:when test="$precision = 'DATE_AND_TIME'">
				<xsl:value-of select="xr-date-formatter:formatDate($date_time, $DATE_ONLY_SEQUENCE, $timezone, $current-locale)"/>
			</xsl:when>

			<xsl:when test="$precision = 'WEEK'">
				<xsl:variable name="weekDate" as="xs:string">
					<xsl:value-of select="xr-date-formatter:formatDate($date_time, $DATE_ONLY_SEQUENCE, $timezone, $current-locale)"/>
				</xsl:variable>
				<xsl:value-of select="java-string:format($WeekOf,$weekDate)"/>
			</xsl:when>

			<xsl:when test="$precision = 'MONTH'">
				<xsl:value-of select="xr-date-formatter:formatDate($date_time, $MONTH_YEAR_SEQUENCE, $timezone, $current-locale)"/>
			</xsl:when>

			<xsl:when test="$precision = 'YEAR'">
				<xsl:value-of select="xr-date-formatter:formatDate($date_time, $PR_YEAR_SEQUENCE, $timezone, $current-locale)"/>
			</xsl:when>

			<xsl:otherwise>
				<xsl:value-of select="xr-date-formatter:formatDate($date_time, $PR_YEAR_SEQUENCE, $timezone, $current-locale)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- main template -->
	<xsl:template match="/">
		<xsl:if test="n:report/n:clinical-data/n:procedure-data/n:clinical-procedure or n:report/n:clinical-data/n:procedure-order-data/n:procedure-order">

			<!-- This is a list of procedures with all of the elements needed for display including a sort order. -->
			<!-- NOTE: This list of procedures does NOT conform to the format specified by the .xsd! It is a temporary
							 data structure that is easier to work with and contains everything that will be used in the display. -->
			<xsl:variable name="SortableProcedures">
				<xsl:if test="n:report/n:clinical-data/n:procedure-data/n:clinical-procedure">
					<xsl:apply-templates select="n:report/n:clinical-data/n:procedure-data/n:clinical-procedure" mode="preprocessing"/>
				</xsl:if>
				<xsl:if test="n:report/n:clinical-data/n:procedure-order-data/n:procedure-order">
					<xsl:apply-templates select="n:report/n:clinical-data/n:procedure-order-data/n:procedure-order" mode="preprocessing"/>
				</xsl:if>
			</xsl:variable>

			<ul style="list-style-type: disc; margin: 0; padding-left: 15px">
				<xsl:for-each select="$SortableProcedures/procedure">
					<!-- first, we sort by date -->
					<xsl:sort select="@sortOrder" data-type="text" order="descending"/>
					<!-- then, we sort by description -->
					<xsl:sort select="lower-case(@description)" data-type="text" order="ascending"/>
					<li class="ddemrcontentitem ddremovable">
						<xsl:attribute name="dd:entityid">
							<xsl:value-of select="@id" />
						</xsl:attribute>
						<xsl:attribute name="dd:contenttype">
							<xsl:choose>
								<xsl:when test="@type='CLINICAL_PROCEDURE'">
									<xsl:text>PROCEDURES</xsl:text>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>PROC_ORDERS</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>

						<!-- Put the procedures in a comma separated list -->
						<xsl:variable name="ProcedureDisplay" as="xs:string" select="@display"/>
						<xsl:value-of select="$ProcedureDisplay"/>
					</li>
				</xsl:for-each>
			</ul>
		</xsl:if>		
	</xsl:template>
</xsl:stylesheet>
