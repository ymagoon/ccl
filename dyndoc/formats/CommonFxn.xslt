<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:f="urn:footnote"
	exclude-result-prefixes="xs fn n cdocfx java-string xr-date-formatter doc">

	<xsl:variable name="root-node" select="/"/>
	<!-- Date Time Variables -->
	<!--WARNING!!!  To use this include file and the date time functions, it is important that you declare a
		variable in the consumer of this template named "current-locale" to declare the language for this template.
		Example: <xsl:param as="xs:string" name="current-locale" select="'en_US'"/> -->
	<xsl:variable name="current-language"
		select="if (contains($current-locale, '_')) then substring-before($current-locale, '_') else $current-locale"/>
	<xsl:variable name="current-country" select="substring-after($current-locale, '_')"/>
	<xsl:param as="xs:string" name="date-format-pattern" select="'[M]/[D]/[Y]'"/>
	<xsl:param as="xs:string" name="io-date-format-pattern" select="'[M]/[D]/[Y]'"/>
	<xsl:param as="xs:string" name="time-format-pattern" select="'[H01]:[m01] [ZN]'"/>
	<xsl:param as="xs:string" name="dateTime-format-pattern" select="'[M]/[D]/[Y] [H01]:[m01] [ZN]'"/>
	<xsl:param as="xs:string" name="month-year-format-pattern" select="'[M]/[Y]'"/>
	<xsl:param as="xs:string" name="year-format-pattern" select="'[Y]'"/>
	<xsl:param name="textMonth-year-pattern" as="xs:string" select="'[MNn,*-3] [Y]'"/>
	<xsl:param name="textMonth-date-format-pattern" as="xs:string" select="'[MNn,*-3] [D] [Y]'"/>
	<xsl:param name="textMonth-dateTime-format-pattern" as="xs:string"
		select="'[MNn,*-3] [D] [Y] [H01]:[m01] [z]'"/>
	<xsl:variable name="PR_YEAR" as="xs:string" select="'YEAR'"/>
	<xsl:variable name="PR_MONTH" as="xs:string" select="'MONTH'"/>
	<xsl:variable name="PR_DAY" as="xs:string" select="'DAY'"/>
	<xsl:variable name="PR_MONTH_YEAR" as="xs:string" select="'MONTH_AND_YEAR'"/>
	<xsl:variable name="multiValueSeparator" as="xs:string">
		<xsl:text>, </xsl:text>
	</xsl:variable>
	<xsl:variable name="newLine" as="xs:string">
		<xsl:value-of select="'&lt;br/&gt;'"/>
	</xsl:variable>
	
	<!-- Variables used for removing Trailing Zeros based on Locale -->
	<xsl:variable name="English" as="xs:string" select="'en'"/>
	<xsl:variable name="French" as="xs:string" select="'fr'"/>
	<xsl:variable name="German" as="xs:string" select="'de'"/>
	<xsl:variable name="Spanish" as="xs:string" select="'es'"/>

	<xsl:key match="n:report/n:personnel-list/n:personnel" name="personnels" use="@prsnl-id"/>
	<xsl:key match="n:report/n:code-list/n:code" name="code_values" use="@code"/>
	<xsl:key match="n:report/n:nomenclature-list/n:nomenclature" name="nomenclatures" use="@nomenclature-id"/>
	<xsl:key match="n:report/n:order-catalog-list/n:order-catalog" name="order_catalog" use="@order-catalog-id"/>
	<xsl:key match="n:report/n:location-list/n:location" name="locations" use="@id"/>
	
	<xsl:function name="cdocfx:getDateDisplayBasedOnPrecision" as="xs:string">
		<xsl:param name="date_node"/>
		<xsl:variable name="date_time" as="xs:dateTime" select="$date_node/@date"/>
		<xsl:choose>
			<xsl:when test="$date_node/@precision-type=$PR_YEAR">
				<xsl:value-of select="fn:format-dateTime($date_time, $year-format-pattern, $current-language, (), $current-country)"/>
			</xsl:when>
			<xsl:when test="$date_node/@precision-type=$PR_MONTH or $date_node/@precision-type=$PR_MONTH_YEAR">
				<xsl:value-of select="fn:format-dateTime($date_time, $textMonth-year-pattern, $current-language, (), $current-country)"/>
			</xsl:when>
			<xsl:when test="$date_node/@precision-type=$PR_DAY">
				<xsl:value-of select="fn:format-dateTime($date_time, $textMonth-date-format-pattern, $current-language, (), $current-country)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:format-dateTime($date_time, $textMonth-dateTime-format-pattern, $current-language, (), $current-country)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- function Name : cdocfx:noOfDaysBetRecDateAndCurrDate -->
	<!-- param 1 Name  : receivedDate -->
	<!-- description   : this function accepts a date and returns the number of years between -->
	<!-- received date and the current date -->
	<xsl:function name="cdocfx:noOfDaysBetRecDateAndCurrDate" as="xs:decimal">
		<xsl:param name="receivedDate" as="xs:string"/>
		
		<xsl:variable name="currentDateFormatted" as="xs:string" select="xs:string(fn:current-dateTime())"/>
		<xsl:variable name="milliSecondsReceivedDate" as="xs:decimal" select="doc:getTimeInMillisecs($receivedDate)"/>
		<xsl:variable name="milliSecondsCurrentDate" as="xs:decimal" select="doc:getTimeInMillisecs($currentDateFormatted)"/>
		<xsl:variable name="differenceInMilliSeconds" as="xs:decimal" select="$milliSecondsCurrentDate - $milliSecondsReceivedDate"/>
		
		<!-- how (24 * 60 * 60 * 1000) -->
		<!-- 1 day = 24 hours  -->
		<!-- 1 day = 24 * 60 minutes -->
		<!-- 1 day = 24 * 60 * 60  seconds -->
		<!-- 1 day = 24 * 60 * 60 * 1000 milliseconds -->
		<xsl:value-of select="($differenceInMilliSeconds) div (24 * 60 * 60 * 1000)"/>
	</xsl:function>

	<xsl:function name="cdocfx:getNomenclatureCodeDispByID">
		<xsl:param name="nomen_id" as="xs:string"/>		
		<xsl:value-of select="key('nomenclatures', $nomen_id, $root-node)/@source-identifier"/>
	</xsl:function>

	<xsl:function name="cdocfx:getNomenclatureDescByID">
		<xsl:param name="nomen_id" as="xs:string"/>
		<xsl:variable name="nomen_element" select="key('nomenclatures', $nomen_id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$nomen_element/@description">
				<xsl:value-of select="$nomen_element/@description"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<xsl:function name="cdocfx:getNomenclatureMnemonicByID">
		<xsl:param name="nomen_id" as="xs:string"/>
		<xsl:variable name="nomen_element" select="key('nomenclatures', $nomen_id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$nomen_element/@mnemonic">
				<xsl:value-of select="$nomen_element/@mnemonic"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<xsl:function name="cdocfx:getNomenclatureShortDescByID">
		<xsl:param name="nomen_id" as="xs:string"/>
		<xsl:variable name="nomen_element" select="key('nomenclatures', $nomen_id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$nomen_element/@short-description">
				<xsl:value-of select="$nomen_element/@short-description"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<xsl:function name="cdocfx:getNomenclatureTerminologyCdByID">
		<xsl:param name="nomen_id" as="xs:string"/>
		<xsl:variable name="nomen_element" select="key('nomenclatures', $nomen_id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$nomen_element/@terminology-code">
				<xsl:value-of select="$nomen_element/@terminology-code"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<xsl:function name="cdocfx:getNomenclatureConceptCKIByID">
		<xsl:param name="nomen_id" as="xs:string"/>
		<xsl:variable name="nomen_element" select="key('nomenclatures', $nomen_id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$nomen_element/@concept-cki">
				<xsl:value-of select="$nomen_element/@concept-cki"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<xsl:function name="cdocfx:getCodeDisplayByID">
		<xsl:param name="code_id" as="xs:string"/>
		<xsl:value-of select="key('code_values', $code_id, $root-node)/@display"/>
	</xsl:function>
	
	<xsl:function name="cdocfx:getCodeMeanByID">
		<xsl:param name="code_id" as="xs:string"/>
		<xsl:value-of select="key('code_values', $code_id, $root-node)/@meaning"/>
	</xsl:function>

	<xsl:function name="cdocfx:getCodeSequenceByID">
		<xsl:param name="code_id" as="xs:string"/>
		<xsl:value-of select="key('code_values', $code_id, $root-node)/@sequence"/>
	</xsl:function>

	<xsl:function name="cdocfx:getProviderNameFullByID">
		<xsl:param name="providerId" as="xs:string"/>
		<xsl:value-of select="key('personnels', $providerId, $root-node)/n:provider-name/@name-full"/>
	</xsl:function>

	<!-- Returns the location node designated by the passed in location id. -->
	<xsl:function name="cdocfx:getLocationById">
		<xsl:param name="locId" as="xs:string"/>
		<xsl:sequence select="key('locations', $locId, $root-node)"/>
	</xsl:function>

	<xsl:function name="cdocfx:get-clinical-display" as="xs:string?">
		<xsl:param name="input-annotated-display" as="xs:string?"/>
		<xsl:param name="input-name" as="element()?"/>
		<xsl:choose>
			<xsl:when test="string($input-annotated-display)">
				<xsl:sequence select="$input-annotated-display"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:sequence select="cdocfx:get-loose-name-display($input-name)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<xsl:function name="cdocfx:get-loose-name-display" as="xs:string">
		<xsl:param name="input-name" as="element()?"/>
		<xsl:choose>
			<xsl:when test="$input-name/n:nomenclature">
				<xsl:value-of select="cdocfx:getNomenclatureDescByID($input-name/n:nomenclature)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$input-name/n:freetext"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<xsl:function name="cdocfx:removeTrailingZeros" as="xs:string">
		<xsl:param name="input-name"/>
		<xsl:param name="SystemLocale" as="xs:string"/>

		<!-- If the System locale is populated, use the first two letters of System locale, otherwise use
			the first two letters of the locale defined in the format-->
		<xsl:variable name="Locale" as="xs:string">
			<xsl:choose>
				<xsl:when test="$SystemLocale != ''">
					<xsl:value-of select="substring($SystemLocale, 1, 2)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="substring($current-locale, 1, 2)"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<!-- Determine the decimal separator based on the locale -->
		<xsl:variable name="decimal-separator" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Locale = $English">
					<xsl:value-of select="'.'"/>
				</xsl:when>
				<xsl:when test="($Locale = $French) or ($Locale = $German) or ($Locale = $Spanish)">
					<xsl:value-of select="','"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<!-- Get number after the decimal separator -->
		<xsl:variable name="ValueAfterSeparator" select="number(substring-after($input-name, $decimal-separator))"/>
		<xsl:choose>
			<xsl:when test="$ValueAfterSeparator = 0">
				<xsl:value-of select="substring-before($input-name, $decimal-separator)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$input-name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Given a measurement value, this function will determine what type of value it is, and build the appropriate display. -->
	<!--    NOTE: This will NOT display units that may be associated with the value. Use cdocfx:getMeasurementValueDisplayWithUnits to output units-->
	<!-- Parameters: -->
	<!-- 	value - the measurement value node -->
	<!-- 	datePattern - the date pattern to use in the case where this is a date based value -->
	<xsl:function name="cdocfx:getMeasurementValueDisplay">
		<xsl:param name="value" as="element()?"/>
		<xsl:param name="datePattern" as="xs:string"/>

		<xsl:choose>
			<xsl:when test="$value/n:blob">
				<xsl:choose>
					<xsl:when test="$value/n:blob/@text-format='STRIPPED_TEXT'">
						<xsl:value-of select="doc:convertPlainTextToHtml($value/n:blob)"/>
					</xsl:when>
					<xsl:when test="$value/n:blob/@text-format = 'ESCAPED_FO'">
						<xsl:value-of select="cdocfx:getFormattedBlobDisplay($value/n:blob)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$value/n:blob" />
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$value/n:string">
				<xsl:value-of select="doc:convertPlainTextToHtml($value/n:string)" />
			</xsl:when>
			<xsl:when test="$value/n:date">
				<xsl:choose>
					<xsl:when test="$value/n:date/n:date-and-time">
						<xsl:variable name="UpdtDtTm" as="xs:dateTime" select="$value/n:date/n:date-and-time"/>
						<xsl:variable name="TimeZone" as="xs:string">
							<xsl:choose>
								<xsl:when test="$value/n:date/n:date-and-time/@time-zone">
									<xsl:value-of select="$value/n:date/n:date-and-time/@time-zone" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						
						<xsl:value-of select="xr-date-formatter:formatDate($UpdtDtTm, $datePattern, $TimeZone, $current-locale)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:variable name="UpdtDtTm" as="xs:date" select="$value/n:date/n:date-only"/>
						<xsl:variable name="TimeZone" as="xs:string">
							<xsl:choose>
								<xsl:when test="$value/n:date/n:date-only/@time-zone">
									<xsl:value-of select="$value/n:date/n:date-only/@time-zone" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						
						<xsl:value-of select="xr-date-formatter:formatDate($UpdtDtTm, $datePattern, $TimeZone, $current-locale)"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$value/n:quantity">
				<xsl:value-of select="$value/n:quantity/@localized-value-display"/>
			</xsl:when>
			<xsl:when test="$value/n:coded">
				<xsl:for-each select="$value/n:coded/n:code-value">
					<xsl:if test="n:nomenclature"><xsl:value-of select="cdocfx:getNomenclatureDescByID(n:nomenclature)" /></xsl:if>
					<xsl:if test="position() != last()"><xsl:value-of select="$multiValueSeparator" /></xsl:if>
				</xsl:for-each>
				<xsl:if test="$value/n:coded/@other-response">
					<xsl:if test="$value/n:coded/n:code-value"><xsl:value-of select="$multiValueSeparator" /></xsl:if>
					<xsl:value-of select="$value/n:coded/@other-response" />
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Given a measurement value, this function will determine what type of value it is, and build the appropriate display with units. -->
	<!-- Parameters: -->
	<!--  measurement - the measurement node -->
	<!--  measValueUnit - format for measurement value and measurement unit -->
	<xsl:function name="cdocfx:getMeasurementValueDisplayWithUnits">
		<xsl:param name="measurement" as="element()?"/>
		<xsl:param name="measValueUnit" as="xs:string"/>
		
		<xsl:variable name="tempMeasValue" as="xs:string">
			<xsl:value-of select="$measurement/n:value/n:quantity/@localized-value-display"/>
		</xsl:variable>
		<xsl:variable name="tempMeasUnit" as="xs:string">
			<xsl:choose>
				<xsl:when test="$measurement/n:value/n:quantity/@unit-code">
					<xsl:value-of select="cdocfx:getCodeDisplayByID($measurement/n:value/n:quantity/@unit-code)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:value-of select="if($tempMeasUnit) then java-string:format($measValueUnit, ($tempMeasValue, $tempMeasUnit)) else $tempMeasValue"/>
	</xsl:function>
	
	<!-- Given a blob value, this function will build the appropriate display based on the blob type -->
	<!-- Parameters: -->
	<!--  blob - the blob node -->
	<xsl:function name="cdocfx:getFormattedBlobDisplay">
		<xsl:param name="blob"/>
		<xsl:if test="$blob">
			<!-- The first flag indicates what style(s) to remove from the converted HTML
			0-don't remove styles; 1-remove font face; 2-remove font size; 3-remove both font face and size
			If this is 0 or 1, then the next four flags will be ignored.

			The next four flags indicate font size boundaries and the desired smallest and largest font sizes.
			They represent lower bound, upper bound, desired smallest font size, and desired largest font size, respectively.
			Font sizes smaller than or equal to the lower bound will be replaced with the desired smallest font size.
			Font sizes larger than or equal to the upper bound will be replaced with the desired largest font size.
			For example, doc:convertFOtoHTML($FoBlob,3,8,15,8,14) means font sizes <= 8pt will be replaced with 8pt;
			while font sizes >= 15pt will be replaced with 14pt. -->
			<xsl:value-of disable-output-escaping="yes" select="doc:convertFOtoHTML($blob,3,8,14,8,14)"/>
		</xsl:if>
	</xsl:function>

	<!-- Given a measurement value, this function will determine what type of value it is, and build the appropriate display with units. -->
	<!-- Any measurement comments will be appended to the end of the value & units -->
	<!-- Parameters: -->
	<!--  measurement - the measurement node -->
	<!--  dateTimePattern - date and time pattern -->
	<!--  dateOnlyPattern - date only pattern -->
	<!--  valueUnitFormat - format for measurement value and measurement unit -->
	<xsl:function name="cdocfx:getMeasurementValue">
		<xsl:param name="measurement" as="element()?"/>
		<xsl:param name="dateTimePattern" as="xs:string"/>
		<xsl:param name="dateOnlyPattern" as="xs:string"/>
		<xsl:param name="valueUnitFormat" as="xs:string"/>
		
		<!-- If the measurement is a quantity value then we also want to display the units -->
		<xsl:choose>
			<xsl:when test="$measurement/n:value/n:quantity">
				<xsl:value-of select="cdocfx:getMeasurementValueDisplayWithUnits($measurement, $valueUnitFormat)"/>
			</xsl:when>			
			<xsl:when test="$measurement/n:value/n:date/n:date-only">
				<xsl:value-of select="cdocfx:getMeasurementValueDisplay($measurement/n:value, $dateOnlyPattern)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="cdocfx:getMeasurementValueDisplay($measurement/n:value, $dateTimePattern)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Given a measurement value, this function will return the associated comment in HTML format if it exists or else will return empty. -->
	<!-- Parameters: -->
	<!--  measurement - The measurement node. -->
	<xsl:function name="cdocfx:getMeasurementComments">
		<xsl:param name="measurement" as="element()?"/>
		
		<xsl:choose> 
			<xsl:when test="$measurement/n:comment/n:comment">
				<xsl:for-each select="$measurement/n:comment">
					<xsl:choose>
						<xsl:when test="n:comment/@text-format = 'ESCAPED_FO'">
							<xsl:value-of select="doc:convertFOtoHTML(n:comment,3,8,14,8,14)" />
							<xsl:if test="position() != last()"><xsl:value-of select="$newLine"/></xsl:if>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="doc:convertPlainTextToHtml(n:comment)" />
							<xsl:if test="position() != last()"><xsl:value-of select="$multiValueSeparator"/></xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="''"/></xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Given a measurement value, this function will determine the measurement interpretation (normalcy) -->
	<!-- Parameters: -->
	<!--  measurement - the measurement node -->
	<!--  Abnormal - string to output for abnormal result -->
	<!--  Critical - string to output for critical result (high or low) -->
	<!--  NormalHigh - string to output for high result -->
	<!--  NormalLow - string to output for low result -->
	<xsl:function name="cdocfx:getMeasurementInterpretation">
		<xsl:param name="measurement"/>
		<xsl:param name="Abnormal" />
		<xsl:param name="Critical"/>
		<xsl:param name="NormalHigh"/>
		<xsl:param name="NormalLow"/>
		<xsl:choose>
			<xsl:when test="$measurement/@interpretation-code">
				<xsl:variable name="Interpretation" as="xs:string">
					<xsl:variable name="NormalcyMean" as="xs:string">
						<xsl:value-of select="cdocfx:getCodeMeanByID($measurement/@interpretation-code)"/>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="($NormalcyMean = 'CRITICAL') or ($NormalcyMean = 'EXTREMEHIGH')
							or ($NormalcyMean = 'PANICHIGH') or ($NormalcyMean = 'EXTREMELOW') or ($NormalcyMean = 'PANICLOW')
							or ($NormalcyMean = 'VABNORMAL') or ($NormalcyMean = 'POSITIVE')">
							<xsl:value-of select="$Critical"/>
						</xsl:when>
						<xsl:when test="($NormalcyMean = 'ABNORMAL')">
							<xsl:value-of select="$Abnormal"/>
						</xsl:when>
						<xsl:when test="($NormalcyMean = 'HIGH')">
							<xsl:value-of select="$NormalHigh"/>
						</xsl:when>
						<xsl:when test="($NormalcyMean = 'LOW')">
							<xsl:value-of select="$NormalLow"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="''"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>			
				<xsl:value-of select="$Interpretation" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- Determines which date pattern to use based on whether or not UTC is turned on in the domain. -->
	<!-- Parameters: -->
	<!-- 	bIsUTCOn - indicates whether or not UTC is turned on/off in the domain -->
	<!-- 	datePatternUTCOn - the date pattern to use when UTC is turned ON in the domain -->
	<!-- 	datePatternUTCOff - the date pattern to use when UTC is turned OFF in the domain -->
	<xsl:function name="cdocfx:getDateDisplayPattern" as="xs:string">
		<xsl:param name="bIsUTCOn" as="xs:boolean"/>
		<xsl:param name="datePatternUTCOn" as="xs:string"/>
		<xsl:param name="datePatternUTCOff" as="xs:string"/>

		<xsl:choose>
			<xsl:when test="$bIsUTCOn = true()">
				<xsl:value-of select="$datePatternUTCOn"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$datePatternUTCOff"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This function returns the display for the given order. This method returns the order's clinical name if it exists, otherwise it returns the 
		 reference name if it exists, otherwise an empty string is returned. -->
	<!-- Parameters: -->
	<!-- 	order - The order for which the display is to be returned. -->
	<xsl:function name="cdocfx:getOrderDisplay" as="xs:string">
		<xsl:param name="order" as="element()?"/>
		
		<xsl:choose>
			<xsl:when test="$order/@clinical-name">
				<xsl:value-of select="$order/@clinical-name"/>
			</xsl:when>
			<xsl:when test="$order/@reference-name">
				<xsl:value-of select="$order/@reference-name"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This function checks if the status code meaning is authenticated (AUTH/ALTERED/MODIFIED). -->
	<!-- Parameters: -->
	<!-- statusCode - the status code meaning to check against -->
	<xsl:function name="cdocfx:isStatusCodeAuthenticated" as="xs:boolean">
		<xsl:param name="statusCode" as="xs:string"/>
		<xsl:value-of select="$statusCode = 'AUTH' or $statusCode = 'ALTERED' or $statusCode = 'MODIFIED'"/>
	</xsl:function>

	<!-- This function checks if the status code meaning is any flavor of "in error" (INERROR/IN ERROR/INERRNOMUT/INERRNOVIEW). -->
	<!-- Parameters: -->
	<!-- statusCode - the status code meaning to check against -->
	<xsl:function name="cdocfx:isStatusCodeInError" as="xs:boolean">
		<xsl:param name="statusCode" as="xs:string"/>
		<xsl:value-of select="$statusCode = 'INERROR' or $statusCode = 'IN ERROR' or $statusCode = 'INERRNOMUT' or $statusCode = 'INERRNOVIEW'"/>
	</xsl:function>

	<xsl:function name="cdocfx:getNoteTitleDisplay" as="xs:string">
		<xsl:param name="footnote" as="element()" />
		<xsl:choose>
			<xsl:when test="$footnote/f:note/@doc-type='RADIOLOGY' and $footnote/f:note/f:event-cd-display">
				<xsl:value-of select="$footnote/f:note/f:event-cd-display"/>
			</xsl:when>
			<xsl:when test="normalize-space($footnote/f:note/f:title)">
				<xsl:value-of select="$footnote/f:note/f:title"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$footnote/f:note/f:event-cd-display"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Format the given date using the given pattern. -->
	<!-- Parameters: -->
	<!-- date - The date to be formatted. -->
	<!-- datePattern - The pattern to be used for formatting the date. -->
	<xsl:function name="cdocfx:getFormattedDateTime">
		<xsl:param name="date" as="element()?"/>
		<xsl:param name="datePattern" as="xs:string"/>
		
		<xsl:choose>
			<xsl:when test="$date">
				<xsl:variable name="dateTime" as="xs:dateTime" select="$date"/>
				<xsl:variable name="timezone" as="xs:string" select="$date/@time-zone"/> <!-- time-zone is a required attribute. -->
				<xsl:variable name="dateTimeString" as="xs:string" select="$date"/> <!-- This is used to test whether the date time is empty. Empty date time can cause an error to formatDate. -->
				
				<xsl:choose>
					<xsl:when test="$dateTimeString != ''">
						<xsl:value-of select="xr-date-formatter:formatDate($dateTime, $datePattern, $timezone, $current-locale)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- This function generate image data with Base 64 code append to it. -->
	<!-- Parameters: -->
	<!-- image - the note of image -->
	<xsl:function name="cdocfx:buildBase64ImageDataURI" as="xs:string">
		<xsl:param name="image"/>
		<xsl:value-of select="fn:concat('data:', $image/@mime-type, ';base64,', $image)"/>
	</xsl:function>

	<!-- Place a space after a slash for breaking long multim order name -->
	<xsl:function name="cdocfx:space-after-slash" as="xs:string">
		<xsl:param name="StringToEvaluate" />
		<xsl:value-of select="replace(replace($StringToEvaluate,'\\','\\ '), '/', '/ ')"/>
	</xsl:function>	

    <!-- This function finds the given Id from the given List of Ids. This method returns true if given Id exists in the List, 
         otherwise false is returned. -->
    <!-- Parameters: -->
    <!--      id - The id which needs to be found in the list. -->
    <!--      idList - The list in which the id needs to be found. -->
	<xsl:function name="cdocfx:findIdInList" as="xs:boolean">
		<xsl:param name="id"/>
		<xsl:param name="listOfIds"/>
			<xsl:choose>
				<xsl:when test="$listOfIds=$id">
					<xsl:value-of select="fn:true()"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="fn:false()"/>
				</xsl:otherwise>
			</xsl:choose>	
	</xsl:function>
	
	<!-- containsLongString returns true if there are any long, contiguous sequences of characters not broken by a delimiter that would cause the text to wrap in a web browser -->
	<xsl:template name="containsLongString">
		<xsl:param name="StringToEvaluate" />
		<xsl:param name="count" />
		<xsl:param name="CharacterLimit" as="xs:integer"/>
		<xsl:choose>
			<xsl:when test="$count &gt;= $CharacterLimit">
				<xsl:value-of select="true()"></xsl:value-of>
			</xsl:when>
			<xsl:when test="$StringToEvaluate=''">
				<xsl:value-of select="false()"></xsl:value-of>
			</xsl:when>
			<xsl:when test="substring(cdocfx:space-after-slash($StringToEvaluate),1,1)=' ' or substring(cdocfx:space-after-slash($StringToEvaluate),1,1)='-'">
				<xsl:call-template name="containsLongString">
					<xsl:with-param name="StringToEvaluate" select="substring($StringToEvaluate, 2)"/>
					<xsl:with-param name="count" select="0"></xsl:with-param>
					<xsl:with-param name="CharacterLimit" select="$CharacterLimit"></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="containsLongString">
					<xsl:with-param name="StringToEvaluate" select="substring($StringToEvaluate, 2)"/>
					<xsl:with-param name="count" select="$count + 1"></xsl:with-param>
					<xsl:with-param name="CharacterLimit" select="$CharacterLimit"></xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>